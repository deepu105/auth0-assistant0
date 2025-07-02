### 1. Configure Auth0 AI

First, you must install the SDK:

```bash showLineNumbers
npm install @auth0/ai-langchain
```

Then, you need to initialize Auth0 AI and set up the connection to request access tokens with the required GitHub scopes.

```typescript showLineNumbers title="./src/lib/auth0-ai.ts"
import { Auth0AI } from "@auth0/ai-langchain";

const auth0AI = new Auth0AI();

export const withGitHub = auth0AI.withTokenForConnection({
  connection: "github",
  scopes: ["repo"],
  // Optional: By default, the SDK will expect the refresh token from
  // the LangChain RunnableConfig (`config.configurable._credentials.refreshToken`)
  // If you want to use a different store for refresh token you can set up a getter here
  // refreshToken: async () => await getRefreshToken(),
});
```

### 2. Integrate your tool with GitHub

Wrap your tool using the Auth0 AI SDK to obtain an access token for the GitHub API.

```typescript showLineNumbers title="./src/lib/tools/listRepositories.ts"
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";
// highlight-start
import { getAccessTokenForConnection } from "@auth0/ai-langchain";
import { FederatedConnectionError } from "@auth0/ai/interrupts";
import { withGitHub } from "@/lib/auth0-ai";
// highlight-end
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// highlight-next-line
export const listRepositories = withGitHub(
  tool(async () => {
    // Get the access token from Auth0 AI
    // highlight-next-line
    const accessToken = getAccessTokenForConnection();

    // GitHub SDK
    try {
      // highlight-start
      const octokit = new Octokit({
        auth: accessToken,
      });
      // highlight-end

      const { data } = await octokit.rest.repos.listForAuthenticatedUser();

      return data.map((repo) => repo.name);
    } catch (error) {
      console.log("Error", error);

      if (error instanceof RequestError) {
        if (error.status === 401) {
          // highlight-start
          throw new FederatedConnectionError(
            `Authorization required to access the Federated Connection`
          );
          // highlight-end
        }
      }

      throw error;
    }
  },
  {
    name: "list_github_repositories",
    description: "List respositories for the current user on GitHub",
    schema: z.object({}),
  })
);
```

Now that the tool is protected, you can pass it your LangGraph agent as part of a `ToolNode`. The agent will automatically request the access token when the tool is called.

```typescript showLineNumbers title="./src/lib/agent.ts"
import { AIMessage } from "@langchain/core/messages";
import { RunnableLike } from "@langchain/core/runnables";
import { END, InMemoryStore, MemorySaver, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

// highlight-next-line
import { listRepositories } from "@/lib/tools/listRepositories";

const model = new ChatOpenAI({ model: "gpt-4o", }).bindTools([
  // highlight-next-line
  listRepositories,
]);

const callLLM = async (state: typeof MessagesAnnotation.State) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

const routeAfterLLM: RunnableLike = function (state) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  if (!lastMessage.tool_calls?.length) {
    return END;
  }
  return "tools";
};

const stateGraph = new StateGraph(MessagesAnnotation)
  .addNode("callLLM", callLLM)
  .addNode(
    "tools",
    new ToolNode(
      [
        // A tool with federated connection access
        // highlight-next-line
        listRepositories,
        // ... other tools
      ],
      {
        // Error handler should be disabled in order to
        // trigger interruptions from within tools.
        // highlight-next-line
        handleToolErrors: false,
      }
    )
  )
  .addEdge(START, "callLLM")
  .addConditionalEdges("callLLM", routeAfterLLM, [END, "tools"])
  .addEdge("tools", "callLLM");

const checkpointer = new MemorySaver();
const store = new InMemoryStore();

export const graph = stateGraph.compile({
  checkpointer,
  store,
});
```

### 3. Handle authentication redirects

Interrupts are a way for the system to pause execution and prompt the user to take an action —such as authenticating or granting API access— before resuming the interaction. This ensures that any required access is granted dynamically and securely during the chat experience. In this context, Auth0-AI SDK manages such authentication redirects integrated with the Langchain SDK.

#### Server Side

On the server side of your Next.js application you need to set up a route to handle the Chat API requests. This route will be responsible for forwarding the requests to the LangGraph API. Additionally, you must provide the `refreshToken` to the Langchain's RunnableConfig from the authenticated user's session.

```typescript showLineNumbers title="./src/app/api/langgraph/[..._path]/route.ts"
import { initApiPassthrough } from "langgraph-nextjs-api-passthrough";
// highlight-next-line
import { auth0 } from "@/lib/auth0";

const getRefreshToken = async () => {
  const session = await auth0.getSession();
  const refreshToken = session?.tokenSet.refreshToken as string;
  return refreshToken;
};

export const { GET, POST, PUT, PATCH, DELETE, OPTIONS, runtime } =
  initApiPassthrough({
    apiUrl: process.env.LANGGRAPH_API_URL,
    apiKey: process.env.LANGSMITH_API_KEY,
    runtime: "edge",
    baseRoute: "langgraph/",
    bodyParameters: async (req, body) => {
      if (
        req.nextUrl.pathname.endsWith("/runs/stream") &&
        req.method === "POST"
      ) {
        return {
          ...body,
          // highlight-start
          config: {
            configurable: {
              _credentials: {
                refreshToken: await getRefreshToken(),
              },
            },
          },
          // highlight-end
        };
      }

      return body;
    },
  });
```
:::info
Here, the property `auth0` is an instance of `@auth0/nextjs-auth0` to handle the application auth flows. <br/>
You can check different authentication options for Next.js with Auth0 at the [official documentation.](https://github.com/auth0/nextjs-auth0?tab=readme-ov-file#3-create-the-auth0-sdk-client)
:::

#### Client Side

On this example we utilize the `EnsureAPIAccessPopup` component to show a popup that allows the user to authenticate with GitHub and grant access with the requested scopes. You'll first need to install the `@auth0/ai-components` package:

```bash showLineNumbers
npx @auth0/ai-components add FederatedConnections
```

Then, you can integrate the authentication popup in your chat component, using the interruptions helper from the SDK:

```tsx showLineNumbers title="./src/components/chat.tsx"
import { useStream } from "@langchain/langgraph-sdk/react";
// highlight-start
import { FederatedConnectionInterrupt } from "@auth0/ai/interrupts";
import { EnsureAPIAccessPopup } from "@/components/auth0-ai/FederatedConnections/popup";
// highlight-end

const useFocus = () => {
  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = () => {
    if (!htmlElRef.current) {
      return;
    }
    htmlElRef.current.focus();
  };
  return [htmlElRef, setFocus] as const;
};

export default function Chat() {
  const [threadId, setThreadId] = useQueryState("threadId");
  const [input, setInput] = useState("");
  const thread = useStream({
    apiUrl: `${process.env.NEXT_PUBLIC_URL}/api/langgraph`,
    assistantId: "agent",
    threadId,
    onThreadId: setThreadId,
    onError: (err) => {
      console.dir(err);
    },
  });

  const [inputRef, setInputFocus] = useFocus();
  useEffect(() => {
    if (thread.isLoading) {
      return;
    }
    setInputFocus();
  }, [thread.isLoading, setInputFocus]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    thread.submit(
      { messages: [{ type: "human", content: input }] },
      {
        optimisticValues: (prev) => ({
          messages: [
            ...((prev?.messages as []) ?? []),
            { type: "human", content: input, id: "temp" },
          ],
        }),
      }
    );
    setInput("");
  };

  return (
    <div>
      {thread.messages.filter((m) => m.content && ["human", "ai"].includes(m.type)).map((message) => (
        <div key={message.id}>
          {message.type === "human" ? "User: " : "AI: "}
          {message.content as string}
        </div>
      ))}

      // highlight-start
      {thread.interrupt && FederatedConnectionInterrupt.isInterrupt(thread.interrupt.value) ? (
        <div key={thread.interrupt.ns?.join("")}>
          <EnsureAPIAccessPopup
            interrupt={thread.interrupt.value}
            onFinish={() => thread.submit(null)}
            connectWidget={{
                title: "List GitHub respositories",
                description:"description ...",
                action: { label: "Check" },
              }}
          />
        </div>
      ) : null}
      // highlight-end

      <form onSubmit={handleSubmit}>
        <input ref={inputRef} value={input} placeholder="Say something..." readOnly={thread.isLoading} disabled={thread.isLoading} onChange={(e) => setInput(e.target.value)} />
      </form>
    </div>
  );
}
```
