### 1. Configure Auth0 AI

**Note:** If you started from the [Auth0 Cloudflare Agents starter kit](https://github.com/auth0-lab/cloudflare-agents-starter), you can skip this step as the Auth0 AI SDK is already configured.

First, you must configure your Cloudflare Agent to use Auth0 and both in the Worker and in the Chat Agent itself. We recommend the following two sdks:
- [Auth0 Hono Web SDK](https://github.com/auth0-lab/auth0-hono): for the Worker.
- [Auth0 Cloudflare Agents API SDK](https://github.com/auth0-lab/auth0-cloudflare-agents-api) for the Chat Agent.

You can also check our [Starter Kit](https://github.com/auth0-lab/cloudflare-agents-starter) to understand how to configure this.


Then, you need to install the Auth0 AI SDK for Cloudflare Agents:

```bash showLineNumbers
npm install @auth0/ai-vercel @auth0/ai-cloudflare @auth0/ai
```

Then, you need to initialize Auth0 AI and set up the connection to request access tokens with the required Github scopes.

```typescript showLineNumbers title="./src/lib/auth0-ai.ts"
import { Auth0AI, setGlobalAIContext } from "@auth0/ai-vercel";
import { getCurrentAgent } from "agents";
import type { Chat } from "./chat";

const getAgent = () => {
  const { agent } = getCurrentAgent<Chat>();
  if (!agent) {
    throw new Error("No agent found");
  }
  return agent;
};

setGlobalAIContext(() => ({ threadID: getAgent().name }));

const auth0AI = new Auth0AI();

export const withSlack = auth0AI.withTokenForConnection({
  connection: "sign-in-with-slack",
  scopes: ["channels:read", "groups:read"],
  refreshToken: async () => {
    const credentials = getAgent().getCredentials();
    return credentials?.refresh_token;
  },
});
```

### 2. Integrate your tool with the Slack API

Wrap your tool using the Auth0 AI SDK to obtain an access token for the Slack API.

```typescript showLineNumbers title="./src/agent/tools/listRepositories.ts"
import { ErrorCode, WebClient } from "@slack/web-api";
// highlight-start
import { getAccessTokenForConnection } from "@auth0/ai-vercel";
import { FederatedConnectionError } from "@auth0/ai/interrupts";
import { withSlack } from "@/lib/auth0-ai";
// highlight-end
import { tool } from "ai";
import { z } from "zod";

// highlight-next-line
export const listChannels = withSlack(
  tool({
    description: "List channels for the current user on Slack",
    parameters: z.object({}),
    execute: async () => {
      // Get the access token from Auth0 AI
      // highlight-next-line
      const accessToken = getAccessTokenForConnection();

      // Slack SDK
      try {
        // highlight-next-line
        const web = new WebClient(accessToken);

        const result = await web.conversations.list({
          exclude_archived: true,
          types: "public_channel,private_channel",
          limit: 10,
        });

        return result.channels?.map((channel) => channel.name);
      } catch (error) {
        if (error && typeof error === "object" && "code" in error) {
          if (error.code === ErrorCode.HTTPError) {
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

**Note:** If you started from the [Auth0 Cloudflare Agents starter kit](https://github.com/auth0-lab/cloudflare-agents-starter), you can skip this section as the Auth0 AI SDK is already configured to handle interrupts.

#### Server Side

On the Chat agent class, you need to set up the tool invocation and handle the interruption messaging via the `errorSerializer`.

```typescript showLineNumbers title="./src/agent/chat.ts"
// highlight-start
import { setAIContext } from "@auth0/ai-vercel";
import { errorSerializer, withInterruptions } from "@auth0/ai-vercel/interrupts";
// highlight-end
// Other dependencies
import { AuthAgent, OwnedAgent } from "@auth0/auth0-cloudflare-agents-api";
import { openai } from "@ai-sdk/openai";
import { AIChatAgent } from "agents/ai-chat-agent";

const SuperAgent = OwnedAgent(AuthAgent(AIChatAgent<Env>));

export class Chat extends SuperAgent {
 async onChatMessage(
    onFinish: StreamTextOnFinishCallback<ToolSet>,
    options?: { abortSignal?: AbortSignal }
  ) {
    // Collect all tools, including MCP tools
    const allTools = {
      ...tools,
      ...this.mcp.unstable_getAITools(),
    };
    const claims = this.getClaims();
    // Create a streaming response that handles both text and tool outputs
    const dataStreamResponse = createDataStreamResponse({
      execute: withInterruptions(async (dataStream) => {
        // Process any pending tool calls from previous messages
        // This handles human-in-the-loop confirmations for tools
        const processedMessages = await processToolCalls({
          messages: this.messages,
          dataStream,
          tools: allTools,
          executions,
        });

        // Stream the AI response using GPT-4
        const result = streamText({
          model,
          system: `You are a helpful assistant that can do various tasks...

${unstable_getSchedulePrompt({ date: new Date() })}

If the user asks to schedule a task, use the schedule tool to schedule the task.

The name of the user is ${claims?.name ?? "unknown"}.
`,
          messages: processedMessages,
          tools: allTools,
          onFinish: async (args) => {
            onFinish(
              args as Parameters<StreamTextOnFinishCallback<ToolSet>>[0]
            );
          },
          onError: (error) => {
            // highlight-start
            if (!Auth0Interrupt.isInterrupt(error)) {
              return;
            }
            // highlight-end
            console.error("Error while streaming:", error);
          },
          maxSteps: 10,
        });

        // Merge the AI response stream with tool execution outputs
        result.mergeIntoDataStream(dataStream);
      }),
      // highlight-start
      onError: errorSerializer((err) => {
        console.log(err);
        return "Oops, an error occured!";
      }),
      // highlight-end
    });

    return dataStreamResponse;
  }
}
```

#### Client Side

On this example we utilize the `EnsureAPIAccessPopup` component to show a popup that allows the user to authenticate with Github and grant access with the requested scopes. You'll first need to install the `@auth0/ai-components` package:

```bash showLineNumbers
npx @auth0/ai-components add FederatedConnections
```

Then, you can integrate the authentication popup in your chat component, using the interruptions helper from the SDK:

```tsx showLineNumbers title="./src/components/chat.tsx"
"use client";

import { useChat } from "@ai-sdk/react";
// highlight-start
import { useAgentChatInterruptions } from "@auth0/ai-cloudflare/react";
import { FederatedConnectionInterrupt } from "@auth0/ai/interrupts";
import { EnsureAPIAccessPopup } from "@/components/auth0-ai/FederatedConnections/popup";
// highlight-end

export default function Chat() {

  const {
    messages: agentMessages,
    input: agentInput,
    handleInputChange: handleAgentInputChange,
    handleSubmit: handleAgentSubmit,
    addToolResult,
    clearHistory,
  // highlight-start
    toolInterrupt,
  } = useAgentChatInterruptions({
  // highlight-end
    agent,
    maxSteps: 5,
    id: threadID,
  });

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
            title: "Access to your Slack channels",
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
