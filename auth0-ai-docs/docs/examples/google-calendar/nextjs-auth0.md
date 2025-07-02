### 1. Before you start

- Ensure that the Google connection in Auth0 (`google-oauth2`) has the following scopes configured:
  - `openid`
  - `profile`
  - `email`
  - `https://www.googleapis.com/auth/calendar.freebusy`

### 2. Integrate your tool with Google Calendar

```ts showLineNumbers title="./src/lib/tools/checkUsersCalendar.ts"
import { tool } from "ai";
import { z } from 'zod';
import { google } from "googleapis";
// highlight-next-line
import { auth0 } from "@/lib/auth0";

export const checkUsersCalendar = tool({
  description: 'Check user availability on a given date time on their calendar',
  parameters: z.object({
    date: z.coerce.date(),
  }),
  execute: async ({ date }) => {
    // highlight-next-line
    const { token } = await auth0.getAccessTokenForConnection({ connection: 'google-oauth2' });

    // Google SDK
    const calendar = google.calendar("v3");
    const auth = new google.auth.OAuth2();

    // highlight-next-line
    auth.setCredentials({ access_token: token });

    const response = await calendar.freebusy.query({
      auth,
      requestBody: {
        timeMin: formatISO(date),
        timeMax: addHours(date, 1).toISOString(),
        timeZone: "UTC",
        items: [{ id: "primary" }],
      },
    });

    return {
      available: response.data?.calendars?.primary?.busy?.length === 0,
    };
  }
});
```
:::info
Here, the property `auth0` is an instance of `@auth0/nextjs-auth0` to handle the application auth flows. <br/>
You can check different authentication options for Next.js with Auth0 at the [official documentation.](https://github.com/auth0/nextjs-auth0?tab=readme-ov-file#3-create-the-auth0-sdk-client)
:::

### 3. Set up the API route for the chat

```tsx showLineNumbers title="./src/app/api/chat/route.ts"
import { z } from 'zod';
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { google } from "googleapis";
// highlight-next-line
import { checkUsersCalendar } from "@/lib/tools/checkUsersCalendar";

export const maxDuration = 60;

export async function POST(req) {
  const { messages } = await req.json()

  const response = streamText({
    model: openai('gpt-4o'),
    messages,
    system: "You're a helpful AI assistant that can read events from Google Calendar",
    // highlight-next-line
    tools: { checkUsersCalendar }
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
              case 'tool-invocation':
                return (
                  <pre key={`${message.id}-${i}`}>
                    {JSON.stringify(part.toolInvocation, null, 2)}
                  </pre>
                );
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

### 5. Example UI

Navigate to `https://localhost:3000` to see the chat UI:

![Google Calendar Events Chat UI](/img/google_calendar_events_chat_ui.png)

When the user sends a message like `Get me the next event`, GPT-4 interprets the request and calls the `listEvents` tool. This tool uses a Google access token (retrieved via Auth0) to fetch upcoming events from the user’s Google Calendar.

You can extend the chat UI to display event summaries, highlight meetings, or even visualize the day’s schedule in a timeline view.
