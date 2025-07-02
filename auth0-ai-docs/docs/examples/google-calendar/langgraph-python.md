### 1. Configure Auth0 AI

First, you must install the SDK:

```bash showLineNumbers
pip install auth0-ai-langchain
```

Then, you need to initialize Auth0 AI and set up the connection to request access tokens with the required Google Calendar scopes.

```python showLineNumbers title="./src/lib/auth0-ai.py"
from auth0_ai_langchain.auth0_ai import Auth0AI

auth0_ai = Auth0AI()

with_google = auth0_ai.with_federated_connection(
    connection="google-oauth2",
    scopes=["https://www.googleapis.com/auth/calendar.freebusy"]
    # Optional: By default, the SDK will expect the refresh token from
    # the LangChain RunnableConfig (`config.configurable._credentials.refresh_token`)
    # If you want to use a different store for refresh token you can set up a getter here
    # refresh_token=lambda *_args, **_kwargs:session["user"]["refresh_token"],
)
```

### 2. Integrate your tool with Google Calendar

Wrap your tool using the Auth0 AI SDK to obtain an access token for the Google Calendar API.

```python showLineNumbers title="./src/lib/tools/check_availability.py"
from datetime import datetime, timedelta
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from pydantic import BaseModel
from langchain_core.tools import StructuredTool
# highlight-next-line
from auth0_ai_langchain.federated_connections import get_access_token_for_connection, FederatedConnectionError
# highlight-next-line
from lib.auth0_ai import with_google

class CheckUserCalendarSchema(BaseModel):
    date: datetime

def check_user_calendar_tool_function(date: datetime):
    # Get the access token from Auth0 AI
    # highlight-next-line
    access_token = get_access_token_for_connection()

    # Google SDK
    try:
        # highlight-next-line
        service = build('calendar', 'v3', credentials=Credentials(token=access_token))
        time_min = date.isoformat() + 'Z'
        time_max = (date + timedelta(hours=1)).isoformat() + 'Z'
        body = {
            "timeMin": time_min,
            "timeMax": time_max,
            "timeZone": "UTC",
            "items": [{"id": "primary"}]
        }

        freebusy_query = service.freebusy().query(body=body).execute()
        busy_times = freebusy_query['calendars']['primary'].get('busy', [])
        return {"available": len(busy_times) == 0}
    except HttpError as e:
        if e.resp.status == 401:
            # highlight-next-line
            raise FederatedConnectionError("Authorization required to access the Federated Connection API")

        raise ValueError(f"Invalid response from Google Calendar API: {response.status_code} - {response.text}")

# highlight-next-line
check_user_calendar_tool = with_google(StructuredTool(
    name="check_user_calendar",
    description="Use this function to check if the user is available on a certain date and time",
    args_schema=CheckUserCalendarSchema,
    func=check_user_calendar_tool_function,
))
```

Now that the tool is protected, you can pass it your LangGraph agent as part of a `ToolNode`. The agent will automatically request the access token when the tool is called.

```python showLineNumbers title="./src/lib/agent.py"
from typing import Annotated, Sequence, TypedDict
from langchain.storage import InMemoryStore
from langchain_core.messages import AIMessage, BaseMessage
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph, add_messages
from langgraph.prebuilt import ToolNode
# highlight-next-line
from tools.check_availability import check_user_calendar_tool


class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

llm = ChatOpenAI(model="gpt-4o")
# highlight-next-line
llm.bind_tools([check_user_calendar_tool])

async def call_llm(state: State):
    response = await llm.ainvoke(state["messages"])
    return {"messages": [response]}

def route_after_llm(state: State):
    messages = state["messages"]
    last_message = messages[-1] if messages else None

    if isinstance(last_message, AIMessage) and last_message.tool_calls:
        return "tools"
    return END

workflow = (
    StateGraph(State)
    .add_node("call_llm", call_llm)
    .add_node(
        "tools",
        ToolNode(
            [
                # a tool with federated connection access
                # highlight-next-line
                check_user_calendar_tool,
                # ... other tools
            ],
            # The error handler should be disabled to
            # allow interruptions to be triggered from within tools.
            # highlight-next-line
            handle_tool_errors=False
        )
    )
    .add_edge(START, "call_llm")
    .add_edge("tools", "call_llm")
    .add_conditional_edges("call_llm", route_after_llm, [END, "tools"])
)

graph = workflow.compile(checkpointer=MemorySaver(), store=InMemoryStore())
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

On this example we utilize the `EnsureAPIAccessPopup` component to show a popup that allows the user to authenticate with Google Calendar and grant access with the requested scopes. You'll first need to install the `@auth0/ai-components` package:

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

