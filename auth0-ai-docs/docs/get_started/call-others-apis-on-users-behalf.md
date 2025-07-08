---
id: call-others-apis-on-users-behalf
title: Call Other's APIs on User's Behalf
description: Learn how Auth for GenAI enables AI agents to call other's APIs on the user's behalf.
slug: /call-others-apis-on-users-behalf
sidebar_position: 7
hide_table_of_contents: true
---

import UserAuthPreReq from "@site/src/components/Quickstarts/UserAuthPreReq";
import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import ArrowLink from "@site/src/components/ArrowLink";
import EnvFileUserAuth from "@site/src/components/Quickstarts/EnvFile/envFileUserAuth";

# Call Other's APIs on User's Behalf

Use Auth0 SDKs to fetch access tokens for social and enterprise identity providers from Auth0's [Token Vault](https://auth0.com/docs/secure/tokens/token-vault). Using these access tokens, AI agents integrated with the application can call third-party APIs to perform tasks on the user’s behalf.

By the end of this quickstart, you should have an application integrated with Auth0 and the [Vercel AI SDK](https://sdk.vercel.ai/docs) that can:
1. Retrieve access tokens for a Google social connection.
2. Integrate with an AI agent to call Google Calendar APIs.

<LanguageSelector>
  <Language id="js" name="Next.js" icon="nextjs.svg">

  <UserAuthPreReq userAuth googleConnection openAI/>

## Install dependencies

In the root directory of your project, install the following dependencies:

- `ai`: Core [Vercel AI SDK](https://sdk.vercel.ai/docs) module that interacts with various AI model providers.
- `@ai-sdk/openai`: [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) provider for the [Vercel AI SDK](https://sdk.vercel.ai/docs).
- `@ai-sdk/react`: [React](https://react.dev/) UI components for the [Vercel AI SDK](https://sdk.vercel.ai/docs).
- `zod`: TypeScript-first schema validation library.
- `googleapis`: Node.js client for Google APIs that supports authentication and authorization with OAuth 2.0.

```bash showLineNumbers
npm install ai@4 @ai-sdk/openai@1 @ai-sdk/react@1 zod@3 googleapis@148
```
<!--
## Configure Auth0 application

Use the Auth0 Dashboard to configure your application with the Token Vault grant type:

1. Navigate to **Applications > Applications**.
2. Choose the application you created for the User Authentication quickstart.
3. Under **Advanced Settings > Grant Types**, enable the **Token Exchange - Federated Connection** grant type.
4. Click **Save Changes**.
-->

## Get access tokens for other APIs

Use the Auth0 [Next.js SDK](https://github.com/auth0/nextjs-auth0) to get access tokens for third-party APIs.

### 1. Configure Auth0 to log in with Google

You need to specify additional authorization parameters to enable your application to retrieve access tokens for social connections. The Auth0 Next.js SDK allows you to customize authorization parameters through the query parameters on the `/auth/login` path:

- `connection`: pass in the name of the connection you want the user to sign up for/log into.
- `access_type`: pass in `offline` to allow your server to retrieve access tokens when needed without manual user interaction.
- `prompt`: pass in `consent` to prompt the user to give your application consent for refresh tokens.

```tsx showLineNumbers title="./src/app/page.tsx"
// ...

// If no user session, show sign-up and login buttons.
if (!user) {
  return (
    <main className="flex flex-col items-center justify-center h-screen p-10">
      <a href="/auth/login?screen_hint=signup&connection=google-oauth2&access_type=offline&prompt=consent">
        <button>Sign up with Google</button>
      </a>
      <a href="/auth/login?connection=google-oauth2&access_type=offline&prompt=consent">
        <button>Log in with Google</button>
      </a>
    </main>
  );
}
```

#### Fetch access token for social connection

Once the user is authenticated, you can fetch an access token from the [Token Vault](https://auth0.com/docs/secure/tokens/token-vault) using the Auth0 SDK. In this example, we fetch an access token for a Google social connection:

```ts showLineNumbers title="./src/lib/google.ts"
import { google } from "googleapis";
// highlight-next-line
import { auth0 } from "./auth0";

export async function getGoogleAuth () {
  // Get access token for Google social connection.
  // highlight-next-line
  const { token } = await auth0.getAccessTokenForConnection({ connection: 'google-oauth2' });

  // Create Google OAuth client.
  const googleOAuthClient = new google.auth.OAuth2();
  // highlight-next-line
  googleOAuthClient.setCredentials({ access_token: token });

  return googleOAuthClient;
};
```

### 2. Use access token to call tool from AI agent

Once you’ve obtained the access token for a social connection, you can use it with an AI agent to fetch data during a tool call and provide contextual data in its response.

In our example, we create a file at `src/lib/tools/google-calendar-view.ts`. In the file, we define a tool, `googleCalendarViewTool`, that uses the access token with the Google Calendar API to query for calendar events in a specified date range:

```ts showLineNumbers title="./src/lib/tools/google-calendar-view.ts"
import { tool } from 'ai';
import { z } from 'zod';
import { google } from 'googleapis';
// highlight-next-line
import { getGoogleAuth } from '../google';

// Define a Vercel AI SDK tool.
export const googleCalendarViewTool = tool({
  description: "Check a user's schedule between the given date times on their calendar",
  parameters: z.object({
    timeMin: z.string().datetime().describe('Start time in ISO 8601 format'),
    timeMax: z.string().datetime().describe('End time in ISO 8601 format'),
    timeZone: z.string().optional().describe('Time zone to use for the calendar'),
  }),

  execute: async ({ timeMin, timeMax, timeZone }) => {
    // Get Google OAuth client with access token via Auth0.
    // highlight-next-line
    const auth = await getGoogleAuth();
    const calender = google.calendar({ version: 'v3', auth });

    // Get calendar events for given query.
    const response = await calender.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      timeZone,
    });

    return {
      status: 'success',
      startDate: timeMin,
      endDate: timeMax,
      events: response?.data?.items,
    };
  },
});
```

You need to [obtain an API Key from Open AI](https://platform.openai.com/api-keys) or another provider to use an LLM. Add the API key to your environment variables:

```bash
# ...

# You can use any provider of your choice supported by Vercel AI
OPENAI_API_KEY="YOUR_API_KEY"
```

You can call the tool from your AI app to get calendar events:

```ts showLineNumbers title="./src/app/api/chat/route.ts"
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
// highlight-next-line
import { googleCalendarViewTool } from '@/lib/tools/google-calendar-view';

export async function POST(req: NextRequest) {
  // Get user prompt from request.
  const { prompt }: { prompt: string } = await req.json();

  // Initiates a streaming AI response.
  const result = streamText({
    prompt,
    model: openai('gpt-4o-mini'),
    // Provides external tools the model can call.
    // In this case, Google Calendar integration.
    // highlight-next-line
    tools: { googleCalendarViewTool },
    maxSteps: 2,
    onError({ error }) {
      console.error('streamText error', { error });
    },
  });

  // Converts the streaming result into a Next.js-compatible response.
  return result.toDataStreamResponse();
}
```

## Update client component

Update your client component to use the AI agent route:

```tsx showLineNumbers title="./src/app/page.tsx"
"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useCompletion } from "@ai-sdk/react";

export default function Page() {
  // Extract the user object and loading state from Auth0.
  const { user, isLoading } = useUser();
  // Use streaming response from the Next.js route.
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    api: "/api/chat",
  });

  if (isLoading) return <div>Loading...</div>;
  // If no user, show sign-up and login buttons.
  if (!user) {
    return (
      // ...
    );
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen p-10">
      <h1>Welcome, {user.name}!</h1>
      {/* Main form for interacting with the AI. */}
      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          id="input"
          className="border-zinc-800 border-2 rounded-md p-2 m-2"
        />
        <button
          type="submit"
          className="border-zinc-800 bg-zinc-800 border-2 rounded-md p-2 m-2 text-zinc-50 hover:bg-black"
        >
          Submit
        </button>
        <div>{completion}</div>
      </form>
    </main>
  );
}
```

## Test your application

Start the application with `npm run dev`. Then, navigate to `http://localhost:3000`. If you have already logged in, make sure to log out and log in again using Google. Then, ask your AI Agent a question about your calendar!

That’s it! You successfully integrated external tool-calling features into your project.

Explore [the example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/call-apis-on-users-behalf/others-api-next-js).

  </Language>
  <Language id="python" name="FastAPI" icon="FastAPI.svg">

  <UserAuthPreReq googleConnection openAI/>

  ## Install dependencies

  In the root directory of your project, install the following dependencies:

  - `fastapi`: [FastAPI](https://fastapi.tiangolo.com/) web framework for building APIs with Python.
  - `auth0-server-python`: [Auth0 Server Python SDK](https://pypi.org/project/auth0-server-python/) for implementing user authentication in Python applications.
  - `openai`: OpenAI Python client for accessing the API.
  - `google-api-python-client`: Google API client library for Python.
  - `uvicorn` and `python-dotenv`: Other Python utility libraries.

  ```bash showLineNumbers
  pip3 install fastapi auth0-server-python openai google-api-python-client uvicorn python-dotenv
  ```

  ## Get access tokens for other's APIs

  Use the Auth0 Python SDK and FastAPI to set up an interactive CLI app get access tokens for third-party APIs.

  ### 1. Set up your environment

  In the root directory of your project, create the `.env.local` file and add the following variables. If you created an application with this quickstart, Auth0 automatically populates your environment variables for you:

  Note: Your application’s client secret is masked for you. To get the client secret value, click the copy button on the code sample.
  
  <EnvFileUserAuth />

  To initialize your local Python environment, run these commands in the terminal:
  ```bash showLineNumbers
  python3 -m venv env
  source env/bin/activate
  ```

  ### 2. Configure Auth0 to log in with Google
  Create a file called `src/app.py` and add the following code to import depenencies and instantiate an Auth0 client.

  When you initialize the Auth0 Server Client, you need to specify additional authorization parameters to enable your application to retrieve access tokens for a supported identity provider:

| **Parameter** | **Description** |
|---------------|-----------|
| `scope`       | Requests the following Auth0 scopes to be authorized for the application:<p><ul><li>`openid`: (Required) Indicates that the application intends to use OIDC to verify the user's identity. To learn more read [OpenID connect scopes](https://auth0.com/docs/get-started/apis/scopes/openid-connect-scopes).</li><li>`profile`:  Returns claims that represent basic profile information, including `name`, `family_name`, `given_name`, `middle_name`, `nickname`, `picture`, and `updated_at`.</li><li>`email`: Returns the `email` claim, which contains the user's email address, and `email_verified`, which is a boolean indicating whether the email address was verified by the user.</li><li>`offline_access`: Requests an Auth0 refresh token from the Auth0 Authorization Server, which will be exchanged for a new access token from the requested connection's Token Vault. To learn more, read [Token Vault](https://auth0.com/docs/secure/tokens/token-vault).</li></ul></p> |

```python showLineNumbers title="./src/app.py"
from fastapi import FastAPI, Request, Response
from fastapi.responses import HTMLResponse
from auth0_server_python.auth_server import ServerClient
from asyncio import sleep
from dotenv import load_dotenv
import uvicorn
import threading
import asyncio
import os
import webbrowser

load_dotenv(dotenv_path=".env.local")

# src/app.py
class MemoryTransactionStore:
    def __init__(self):
        self.store = {}

    async def set(self, key, value, options=None):
        self.store[key] = value

    async def get(self, key, options=None):
        return self.store.get(key)

    async def delete(self, key, options=None):
        if key in self.store:
            del self.store[key]

auth0 = ServerClient(
    domain=os.getenv("AUTH0_DOMAIN"),
    client_id=os.getenv("AUTH0_CLIENT_ID"),
    client_secret=os.getenv("AUTH0_CLIENT_SECRET"),
    secret=os.getenv("AUTH0_SECRET"),
    redirect_uri=os.getenv("APP_BASE_URL") + "/auth/callback",
    transaction_store=MemoryTransactionStore(),
    state_store=MemoryTransactionStore(),
    authorization_params={
        "scope": "openid profile email offline_access",
    }
)
```

### 3. Instantiate FastAPI instance

In `src/app.py`, instantiate a FastAPI instance that intercepts incoming requests and applies Auth0's authentication logic:

```python showLineNumbers title="./src/app.py"
# ...

app = FastAPI()

@app.get("/auth/callback",  response_class=HTMLResponse)
async def callback(request: Request):
    result = await auth0.complete_interactive_login(str(request.url))
    if result.get("error"):
        return {"error": result.get("error")}
    else:
        user = result.get("state_data").get("user")
        return f"""
        <html>
            <head>
                <title>Login Successful</title>
                <script>
                    function closeWindow() {{
                        window.close();
                    }}
                </script>
            </head>
            <body>
                <h2>Login Successful!</h2>
                <p>Successful for: {user}</p>
                <h3>You can now close this window.</h3>
                <button onclick="closeWindow()">Close Window</button>
            </body>
        </html>
        """

if __name__ == "__main__":
    server_thread = threading.Thread(
        target=uvicorn.run,
        args=(app,),
        kwargs={"host": "127.0.0.1", "port": 3000, "log_level": "warning"},
        daemon=True,
    )
    server_thread.start()
```

### 4. Add login through the browser

Add the following code to `src/app.py` to ask the user to log in from a browser window:

```python showLineNumbers title="./src/app.py"
# ...

print("-" * 25)
print("Please log in to your account.")
print("Opening browser for authentication...")
print("-" * 25)

async def wait_for_user():
    webbrowser.open(await auth0.start_interactive_login())
    while True:
        user = await auth0.get_user()
        if user:
            break
        await sleep(0.5)
    return user

user = asyncio.run(wait_for_user())
print("Login successful for:", user.get("name"))
print("-" * 25)
```

## Set up an AI Agent to interact with Google Calendar

Set up an OpenAI agent for tool calling with Google Calendar.

### 1. Add required imports

Add the following code to `src/app.py` to import the OpenAI and Google dependencies:

```python showLineNumbers title="./src/app.py"
# ...

print("Proceeding to retrieve your next 5 calendar events...")

from openai import OpenAI
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import datetime
import json
```

### 2. Set up authentication for Google Calendar using Auth0 Token Vault

[Auth0's Token Vault](https://auth0.com/docs/secure/tokens/token-vault) manages the tokens of supported identity providers to enable applications to call third-party APIs.

Add the following code to `src/app.py` to get an access token for Google once the user is logged in.

When you call `get_token_from_token_vault()`, pass in the following parameters:

| **Parameter** | **Scope** |
|---------------|-----------|
| `connection`  | The name of the connection you're requesting access to, in this case, `google-oauth2`.|
| `scope`       | Requests the following Auth0 scopes to be authorized for the application:<p><ul><li>`openid`: (Required) Indicates that the application intends to use OIDC to verify the user's identity. To learn more read [OpenID connect scopes](https://auth0.com/docs/get-started/apis/scopes/openid-connect-scopes).</li><li>`profile`:  Returns claims that represent basic profile information, including `name`, `family_name`, `given_name`, `middle_name`, `nickname`, `picture`, and `updated_at`.</li><li>`email`: Returns the `email` claim, which contains the user's email address, and `email_verified`, which is a boolean indicating whether the email address was verified by the user.</li><li>`offline_access`: Requests an Auth0 refresh token from the Auth0 Authorization Server, which will be exchanged for a new access token from the requested connection's Token Vault. To learn more, read [Token Vault](https://auth0.com/docs/secure/tokens/token-vault).</li></ul></p> |

```python showLineNumbers title="./src/app.py"
# ...

async def get_token_from_token_vault():
  return await auth0.get_access_token_for_connection(
      options = {
          "connection" : "google-oauth2",
          "scope" : "openid profile email offline_access"})

calendar_service = build('calendar', 'v3',
  credentials=Credentials(asyncio.run(get_token_from_token_vault())))
```

### 3. Set up tool calling for calendar events

Add the following code to `src/app.py` to create the calendar tool for listing upcoming Calendar events:

```python showLineNumbers title="./src/app.py"
# ...

tools = [{
    "type": "function",
    "function": {
        "name": "list_upcoming_events",
        "description": "List upcoming calendar events",
        "parameters": {
            "type": "object",
            "properties": {
                "max_results": {"type": "integer", "description": "Maximum number of events to return"}
            },
            "required": []
        }
    }
}]

def list_upcoming_events(max_results=10):
    events = calendar_service.events().list(
        calendarId='primary',
        timeMin=datetime.datetime.now().isoformat() + 'Z',
        timeMax=(datetime.datetime.now() + datetime.timedelta(days=7)).isoformat() + 'Z',
        maxResults=max_results,
        singleEvents=True,
        orderBy='startTime'
    ).execute().get('items', [])

    return json.dumps([{
        "summary": event['summary'],
        "start": event['start'].get('dateTime', event['start'].get('date'))
    } for event in events])
```

### 4. Set up the AI Agent to interact with the tool

Set your OpenAI API key in your environment variables:

```bash showLineNumbers
# .env.local
# ...

OPENAI_API_KEY="YOUR_API_KEY"
```

Add the following code to `src/app.py` to create the AI agent:

```python showLineNumbers title="./src/app.py"
# ...

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def process_user_request(user_input):

    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "user", "content": user_input}
        ],
        tools=tools
    )
    message = response.choices[0].message

    if not message.tool_calls:
        return message.content

    tool_call = message.tool_calls[0]
    result = list_upcoming_events(**json.loads(tool_call.function.arguments))

    return client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "user", "content": user_input},
              message,
            {"role": "tool", "content": result, "tool_call_id": tool_call.id}
        ]
    ).choices[0].message.content
```

### 5. Send a message to the agent to access the user's calendar

Add the following to `src/app.py` to send a sample message to the AI agent to get the user's upcoming calendar events:

```python showLineNumbers title="./src/app.py"
# ...

print(process_user_request("Show my next 5 upcoming calendar events"))
```

## Run the interactive CLI

To run the interactive CLI that triggers the user login prompt, enter the following command in your terminal:

```bash showLineNumbers
python3 src/app.py
```

Once the user has authenticated and authorized the Google social connection, the AI agent will fetch the user's next five upcoming calendar events.

</Language>
</LanguageSelector>

## Next steps

You have successfully added the ability to get access tokens for tool calling to your application. For next steps:
- Learn more about <ArrowLink text="Client-initiated account linking" href="client-initiated-account-linking" newTab={false}/>.
- Learn more about how Auth0's <ArrowLink text="Token Vault" href="https://auth0.com/docs/secure/tokens/token-vault" /> manages the tokens of supported identity providers.
