### 1. Configure Auth0 AI

First, you must install the SDK:

```bash showLineNumbers
npm install @auth0/ai-vercel
```

Then, you need to initialize Auth0 AI and set up the connection to request access tokens with the required GitHub scopes.

```typescript showLineNumbers title="./src/lib/auth0-ai.ts"
import { Auth0AI } from "@auth0/ai-vercel";
import { auth0 } from "@/lib/auth0";

const auth0AI = new Auth0AI();

export const withGitHub = auth0AI.withTokenForConnection({
  connection: "github",
  scopes: ["repo"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    const refreshToken = session?.tokenSet.refreshToken as string;

    return refreshToken;
  },
});
```
:::info
Here, the property `auth0` is an instance of `@auth0/nextjs-auth0` to handle the application auth flows. <br/>
You can check different authentication options for Next.js with Auth0 at the [official documentation.](https://github.com/auth0/nextjs-auth0?tab=readme-ov-file#3-create-the-auth0-sdk-client)
:::

### 2. Integrate your tool with GitHub

Wrap your tool using the Auth0 AI SDK to obtain an access token for the GitHub API.

```typescript showLineNumbers title="./src/lib/tools/listRepositories.ts"
import { Octokit, RequestError } from "octokit";
// highlight-start
import { getAccessTokenForConnection } from "@auth0/ai-vercel";
import { FederatedConnectionError } from "@auth0/ai/interrupts";
import { withGitHub } from "@/lib/auth0-ai";
// highlight-end
import { tool } from "ai";
import { z } from "zod";


// highlight-next-line
export const listRepositories = withGitHub(
  tool({
    description: "List respositories for the current user on GitHub",
    parameters: z.object({}),
    execute: async () => {
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
  })
);
```

### 3. Handle authentication redirects

Interrupts are a way for the system to pause execution and prompt the user to take an action—such as authenticating or granting API access—before resuming the interaction. This ensures that any required access is granted dynamically and securely during the chat experience. In this context, Auth0-AI SDK manages authentication redirects in the Vercel AI SDK via these interrupts.

#### Server Side

On the server-side code of your Next.js App, you need to set up the tool invocation and handle the interruption messaging via the `errorSerializer`. The `setAIContext` function is used to set the async-context for the Auth0 AI SDK.

```typescript showLineNumbers title="./src/app/api/chat/route.ts"
import { createDataStreamResponse, Message, streamText } from "ai";
import { listRepositories } from "@/lib/tools/";
// highlight-start
import { setAIContext } from "@auth0/ai-vercel";
import { errorSerializer, withInterruptions } from "@auth0/ai-vercel/interrupts";
// highlight-end
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  const { id, messages} = await request.json();
  const tools = { listRepositories };
  // highlight-next-line
  setAIContext({ threadID: id });

  return createDataStreamResponse({
    // highlight-next-line
    execute: withInterruptions(
      async (dataStream) => {
        const result = streamText({
          model: openai("gpt-4o-mini"),
          system: "You are a friendly assistant! Keep your responses concise and helpful.",
          messages,
          maxSteps: 5,
          tools,
        });

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      // highlight-next-line
      { messages, tools }
    ),
    // highlight-next-line
    onError: errorSerializer((err) => {
      console.log(err);
      return "Oops, an error occured!";
    }),
  });
}
```

#### Client Side

On this example we utilize the `EnsureAPIAccessPopup` component to show a popup that allows the user to authenticate with GitHub and grant access with the requested scopes. You'll first need to install the `@auth0/ai-components` package:

```bash showLineNumbers
npx @auth0/ai-components add FederatedConnections
```

Then, you can integrate the authentication popup in your chat component, using the interruptions helper from the SDK:

```tsx showLineNumbers title="./src/components/chat.tsx"
"use client";

import { useChat } from "@ai-sdk/react";
// highlight-start
import { useInterruptions } from "@auth0/ai-vercel/react";
import { FederatedConnectionInterrupt } from "@auth0/ai/interrupts";
import { EnsureAPIAccessPopup } from "@/components/auth0-ai/FederatedConnections/popup";
// highlight-end

export default function Chat() {
  const { messages, handleSubmit, input, setInput, toolInterrupt } =
    // highlight-start
    useInterruptions((handler) =>
      useChat({
        onError: handler((error) => console.error("Chat error:", error)),
      })
    );
    // highlight-end

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
        </div>
      ))}

      // highlight-start
      {FederatedConnectionInterrupt.isInterrupt(toolInterrupt) && (
        <EnsureAPIAccessPopup
          interrupt={toolInterrupt}
          connectWidget={{
            title: "List GitHub respositories",
            description:"description ...",
            action: { label: "Check" },
          }}
        />
      )}
      // highlight-end

      <form onSubmit={handleSubmit}>
        <input value={input} placeholder="Say something..." onChange={(e) => setInput(e.target.value)} />
      </form>
    </div>
  );
}
```