### 1. Before you start

- Ensure that the GitHub connection in Auth0 (`github`) has the following scopes configured:
  - `repo`
  - `read:user`

### 2. Integrate your tool with Github

```ts showLineNumbers title="./src/lib/tools/listRepos.ts"
import { tool } from "ai";
import { z } from 'zod';
import { openai } from "@ai-sdk/openai";
import { Octokit } from "@octokit/rest";
// highlight-next-line
import { auth0 } from "@/lib/auth0";

export const listRepos = tool({
  description: 'List respositories for the current user on GitHub',
  parameters: z.object({}),
  execute: async () => {
    // highlight-start
    const { accessToken } = await auth0.getAccessTokenForConnection({ connection: "github" });
    const octokit = new Octokit({ auth: accessToken });
    // highlight-end

    const response = await octokit.request('GET /user/repos', {
      visibility: 'all',
    });

    const filteredRepos = response.data.map(repo => ({
      id: repo.id,
      full_name: repo.full_name,
      private: repo.private,
      owner_name: repo.owner.login,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));

    return filteredRepos;
  }
});
```
:::info
Here, the property `auth0` is an instance of `@auth0/nextjs-auth0` to handle the application auth flows. <br/>
You can check different authentication options for Next.js with Auth0 at the [official documentation.](https://github.com/auth0/nextjs-auth0?tab=readme-ov-file#3-create-the-auth0-sdk-client)
:::

### 3. Set up the API route for the chat

Create an AI tool that fetches GitHub repositories for the authenticated user using Auth0 to get a GitHub access token:


```tsx showLineNumbers title="./src/app/api/chat/route.ts"
import { z } from 'zod';
import { streamText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
const { Octokit } = require("@octokit/rest");

// highlight-next-line
import { listRepos } from "@/lib/tools/listRepos";

export const maxDuration = 60;

export async function POST(req) {
  const { messages } = await req.json()

  const response = streamText({
    model: openai('gpt-4o'),
    messages,
    system: "You're a helpful AI agent that fetches GitHub repositories",
    // highlight-next-line
    tools: { listRepos }
  })
  return response.toDataStreamResponse();
}
```

### 4. Call from the client side

```tsx showLineNumbers title="./src/app/page.tsx"
'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-3xl py-24 mx-auto stretch text-gray-100">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input onChange={handleInputChange} value={input} placeholder="Say something..." className="fixed bottom-0 w-full max-w-3xl p-2 mb-8 border border-zinc-300 rounded shadow-xl text-black" />
      </form>
    </div>
  );
}
```

Navigate to `https://localhost:3000` to see the chat UI show an array of returned GitHub repos for the user.

