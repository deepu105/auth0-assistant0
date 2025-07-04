---
id: call-your-apis-on-users-behalf
title: Call Your APIs on User's Behalf
description: Learn how Auth for GenAI enables AI agents to call first-party APIs on the user's behalf.
slug: /call-your-apis-on-users-behalf
sidebar_position: 7
hide_table_of_contents: true
---

import UserAuthPreReq from "@site/src/components/Quickstarts/UserAuthPreReq";
import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import Card from "@site/src/components/Card";
import ArrowLink from "@site/src/components/ArrowLink";
import EnvFileUserAuth from "@site/src/components/Quickstarts/EnvFile/envFileUserAuth";


# Call Your APIs On User's Behalf

Let your AI agent call your APIs on behalf of the authenticated user using access tokens securely issued by Auth0.

By the end of this quickstart, you should have an application integrated with Auth0 and the [Vercel AI SDK](https://sdk.vercel.ai/docs) that can:

- Get an Auth0 access token.
- Use the Auth0 access token to make a tool call to your API endpoint, in this case, Auth0's `/userinfo` endpoint.
- Return the data to the user via an AI agent.

:::note

We value your feedback! To ask questions, report issues, or request new frameworks and providers, connect with us on [GitHub](https://github.com/auth0/auth-for-genai).

:::

<LanguageSelector>
  <Language id="js" name="Next.js" icon="nextjs.svg">

  <!--should be next and fast api-->

<UserAuthPreReq userAuth openAI />

## Install dependencies

In the root directory of your project, install the following dependencies:

<!--if you have a next.js app already, install these dependencies?-->
- `ai`: Core [Vercel AI SDK](https://sdk.vercel.ai/docs) module that interacts with various AI model providers.
- `@ai-sdk/openai`: [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) provider for the [Vercel AI SDK](https://sdk.vercel.ai/docs).
- `@ai-sdk/react`: [React](https://react.dev/) UI components for the [Vercel AI SDK](https://sdk.vercel.ai/docs).
- `zod`: TypeScript-first schema validation library.

```bash showLineNumbers
npm install ai@4 @ai-sdk/openai@1 @ai-sdk/react@1 zod@3
```

## Define a tool to call your API

In this step, you’ll create a Vercel AI tool to make the first-party API call. The tool fetches an access token to call the API.

In this example, after taking in an Auth0 access token during user login, the tool returns the user profile of the currently logged-in user by calling the [`/userinfo`](https://auth0.com/docs/api/authentication/user-profile/get-user-info) endpoint.

```ts showLineNumbers title="./src/lib/tools/user-info.ts"
import { tool } from "ai";
import { z } from "zod";
import { auth0 } from "../auth0";

export const getUserInfoTool = tool({
  description: "Get information about the current logged in user.",
  parameters: z.object({}),
  execute: async () => {
    const session = await auth0.getSession();
    if (!session) {
      return "There is no user logged in.";
    }

    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${session.tokenSet.accessToken}`,
        },
      },
    );

    if (response.ok) {
      return { result: await response.json() };
    }

    return "I couldn't verify your identity";
  },
});
```

## Create the AI agent API route

The AI agent processes and runs the user’s request through the AI pipeline, including the tool call. Vercel AI simplifies this task with the `streamText()` method:

```ts showLineNumbers title="./src/app/api/chat/route.ts"
import { getUserInfoTool } from "@/lib/tools/user-info";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // streamText is used to run the request
  const result = streamText({
    messages,
    model: openai("gpt-4o-mini"),
    // Provides external tools the model can call.
    // In this case, a User Info tool.
    tools: { getUserInfoTool },
    maxSteps: 2,
    onError({ error }) {
      console.error("streamText error", { error });
    },
  });

  return result.toDataStreamResponse();
}
```

You need an [API Key from Open AI](https://platform.openai.com/api-keys) or another provider to use an LLM. Add that API key to your `.env.local` file:

```bash showLineNumbers title=".env.local"
# ...

# You can use any provider of your choice supported by Vercel AI
OPENAI_API_KEY="YOUR_API_KEY"
```

If you use another provider for your LLM, adjust the variable name in `.env.local` accordingly.

## Build the Chat UI

Before testing the application, update the `/src/app/chat/page.tsx` file with the Chat UI.

The following code sample creates a minimalist and functional chat page to get you started quickly:

```tsx showLineNumbers title="./src/app/chat/page.tsx"
"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({});
  return (
    <main className="flex flex-col items-center justify-center h-screen p-10">
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === "user" ? "User: " : "AI: "}
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          className="w-full border"
          onChange={handleInputChange}
        />
        <button
          className="border-zinc-800 bg-zinc-800 border-2 rounded-md p-2 m-2 text-zinc-50 hover:bg-black"
          type="submit"
        >
          Send
        </button>
      </form>
    </main>
  );
}
```

## Test your application

To test the application, run `npm run dev` and navigate to `http://localhost:3000/chat` and interact with the AI agent. You can ask questions like `“who am I?”` to trigger the tool call and test whether it successfully retrieves information about the logged-in user.

```
User: who am I?
AI: It seems that there is no user currently logged in. If you need assistance with anything else, feel free to ask!

User: who am I?
AI: You are Juan Martinez. Here are your details: - .........
```

That’s it! You’ve successfully integrated first-party tool-calling into your project.

Explore [the example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/call-apis-on-users-behalf/your-api-next-js).

  </Language>
  <Language id="cloudflare" name="Cloudflare Agents" icon="cloudflare.svg">

  <!--should be next and fast api-->

<UserAuthPreReq openAI />


## Start from our Cloudflare Agents template

Our [Auth0 Cloudflare Agents Starter Kit](https://github.com/auth0-lab/cloudflare-agents-starter) provides a starter project that includes the necessary dependencies and configuration to get you up and running quickly.

To create a new Cloudflare Agents project using the template, run the following command in your terminal:

```
npx create-cloudflare@latest --template auth0-lab/cloudflare-agents-starter
```

## About the dependencies

The start kit is similar to the [Cloudflare Agents starter kit](https://github.com/cloudflare/agents-starter) but includes the following dependencies to integrate with Auth0 and Vercel AI:

- `hono`: [Hono](https://hono.dev/) Web Application framework.
- `@auth0/auth0-hono`: [Auth0 SDK](https://github.com/auth0-lab/auth0-hono) for the Hono web framework.
- `hono-agents`: [Hono Agents](https://github.com/cloudflare/agents/tree/main/packages/hono-agents) to add intelligent, stateful AI agents to your Hono app.
- `@auth0/auth0-cloudflare-agents-api`: [Auth0 Cloudflare Agents API SDK](https://github.com/auth0-lab/auth0-cloudflare-agents-api) to secure Cloudflare Agents using bearer tokens from Auth0.
- `@auth0/ai`: [Auth0 AI SDK](https://github.com/auth0-lab/auth0-ai-js) to provide base abstractions for authentication and authorization in AI applications.
- `@auth0/ai-vercel`: [Auth0 Vercel AI SDK](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-vercel) to provide building blocks for using Auth for GenAI with the Vercel AI SDK.
- `@auth0/ai-cloudflare`: [Auth0 Cloudflare AI SDK](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-cloudflare) to provide building blocks for using Auth for GenAI with the Cloudflare Agents API.

**You don't need to install these dependencies manually**; they are already included in the starter kit.
```bash showLineNumbers
npm remove agents
npm install hono \
  @auth0/auth0-hono \
  hono-agents \
  @auth0/auth0-cloudflare-agents-api \
  @auth0/ai-cloudflare \
  @auth0/ai-vercel \
  @auth0/ai
```
## Setup environment variables

In the root directory of your project, copy the `.dev.vars.example` into `.dev.vars` file and configure the Auth0 and OpenAI variables.

## Define a tool to call your API

In this step, you’ll create a Vercel AI tool to make the first-party API call to the Auth0 API. You will do the same for third-party APIs.

In this example, after taking in an Auth0 access token during user login, the Cloudflare Worker send to the token to the Cloudflare Agent using the Authorization header in every web request or websocket connection.

Since the Agent defined in the class Chat in `src/agent/chat.ts` uses the **AuthAgent** trait from the `@auth0/auth0-cloudflare-agents-api` it validates the signature of the token and that it matches the audience of the Agent.

The tool we are defining here uses the same access token to call Auth0's [`/userinfo`](https://auth0.com/docs/api/authentication/user-profile/get-user-info) endpoint.

```ts showLineNumbers title="./src/agent/tools.ts"
const getUserInfoTool = tool({
  description: "Get information about the current logged in user.",
  parameters: z.object({}),
  execute: async () => {
    const { agent } = getCurrentAgent<Chat>();
    const tokenSet = agent?.getCredentials();
    if (!tokenSet) {
      return "There is no user logged in.";
    }

    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${tokenSet.access_token}`,
        },
      }
    );

    if (response.ok) {
      return { result: await response.json() };
    }

    return "I couldn't verify your identity";
  },
});
```

Then in the `tools` export of the `src/agent/chat.ts` file, add the `getUserInfoTool` to the tools array:

```ts showLineNumbers title="./src/agent/chat.ts"
export const tools = {
  // Your other tools...
  getUserInfoTool,
};
```

## Test your application

To test the application, run `npm run start` and navigate to `http://localhost:3000/` and interact with the AI agent. You can ask questions like `“who am I?”` to trigger the tool call and test whether it successfully retrieves information about the logged-in user.

```
User: who am I?
AI: It seems that there is no user currently logged in. If you need assistance with anything else, feel free to ask!

User: who am I?
AI: You are Juan Martinez. Here are your details: - .........
```

That’s it! You’ve successfully integrated first-party tool-calling into your project.

Explore [the start kit on GitHub](https://github.com/auth0-lab/cloudflare-agents-starter).

  </Language>
  <Language id="python" name="FastAPI" icon="FastAPI.svg">

   <UserAuthPreReq openAI/>

## Install dependencies

In the root directory of your project, install the following dependencies:

 - `fastapi`: [FastAPI](https://fastapi.tiangolo.com/) web framework for building APIs with Python.
- `auth0-fastapi-api`: [Auth0's FastAPI API SDK](https://github.com/auth0/auth0-server-python/tree/main/packages/auth0_fastapi_api) to secure APIs using bearer tokens from Auth0.
- `langchain`: [LangChain's](https://pypi.org/project/langchain/) base Python library.
- `langchain-core`: LangChain's [core abstractions](https://pypi.org/project/langchain-core/) library.
- `langchain-openai`: LangChain integrations for OpenAI.
- `uvicorn` and `python-dotenv` `https`: Other Python utility libraries.

```bash showLineNumbers
pip3 install fastapi auth0-fastapi-api langchain langchain-core langchain-openai uvicorn python-dotenv httpx
```

## Set up your environment

In the root directory of your project, create the `.env.local` file and add the following variables. If you created an application with this quickstart, Auth0 automatically populates your environment variables for you:

:::note
Your application’s client secret is masked for you. To get the client secret value, click the copy button on the code sample.
:::

<EnvFileUserAuth />

To initialize your local Python environment, run these commands in the terminal:

```bash showLineNumbers
python3 -m venv env
source env/bin/activate
```

## Create an API in Auth0

In the Auth0 Dashboard, [create an API](https://auth0.com/docs/get-started/auth0-overview/set-up-apis). Set the **Identifier** as `agent0-api`.

Once you've successfully created the API, enable the corresponding `AUTH0_CLIENT_ID` within the **Machine to Machine Applications** tab. This enables that client to request access tokens for this API.

Update the `.env.local` file to set the `AUTH0_API_AUDIENCE` to `agent0-api`, or the identifier for the API you created.

```bash showLineNumbers title=".env.local"
# .env.local
# ...

AUTH0_API_AUDIENCE=agent0-api
```

Next, create a file called `src/app.py` and add the following code to import dependencies and set up the Auth0 configuration:

```python showLineNumbers title="./src/app.py"
import json

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi_plugin import Auth0FastAPI

from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool

from dotenv import load_dotenv
from typing import Any, Dict, List

import httpx
import os
import uvicorn

load_dotenv(dotenv_path=".env.local")
app = FastAPI()

# Set up the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("AGENT0_WEB_HOST")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth0 configuration
auth0 = Auth0FastAPI(
    domain=os.getenv("AUTH0_DOMAIN"),
    audience=os.getenv("AUTH0_API_AUDIENCE"),
)
```
## Define a tool to call your API

In this step, you’ll create a tool to make the first-party API call. The tool fetches an access token to call the API.

Add the following code to `src/app.py` to set up `Agent0` with a token-protected API tool call to Auth0's `/userinfo` endpoint:

```python showLineNumbers title="./src/app.py"
# ...

# OpenAI model
model = ChatOpenAI(
    model="gpt-4o",
    temperature=0,
    api_key=os.getenv("AGENT0_OPENAI_KEY")
)

# Create a prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an AI agent for demonstrating tool calling with Auth0."),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Function to create a tool dynamically with the provided token
def get_user_info_tool(token: str):
    @tool
    async def get_user_info() -> Dict[str, Any]:
        """Fetch user info from Auth0 using the provided token."""
        auth0_domain = os.getenv("AUTH0_DOMAIN")
        if not auth0_domain:
            return {"error": "Auth0 domain is not defined"}

        url = f"https://{auth0_domain}/userinfo"
        headers = {"Authorization": f"Bearer {token}"}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            if response.status_code != 200:
                return {"error": "Failed to fetch user info"}
            return response.json()

    return get_user_info

# Agent execution function
async def agent0(messages: List[Dict], token: str) -> Dict[str, Any]:
    get_user_info = get_user_info_tool(token)  # Inject token dynamically

    tools = [get_user_info]

    # Create the agent using the factory function
    agent = create_tool_calling_agent(model, tools, prompt)

    # Create the agent executor
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
    )

    response = await agent_executor.ainvoke({"input": messages})

    return {"content": response["output"]}
```

## Run API server and handle AI agent requests

Add the following code to `src/app.py` to handle requests to the `/agent` endpoint:

```python showLineNumbers title="./src/app.py"
# ...

@app.post("/agent")
async def agent_api(
    request: Request,
    response: Response,
    claims: dict = Depends(auth0.require_auth())
):
    data = await request.body()
    messages = json.loads(data).get('messages') if data else ""

    if not messages or not isinstance(messages, list):
        detail = "Messages are required and should be an array"
        raise HTTPException(status_code=400, detail=detail)

    try:
        # Retrieve the authorization header with access token
        # in the format "Bearer <token>"
        token = request.headers.get("authorization")
        response = await agent0(messages, token)
        return {"response": response["content"]}
    except Exception as error:
        print(error)
        detail("Failed to get response from agent")
        raise HTTPException(status_code=500, detail=detail)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3000)
```

## Run your API server
Run this command to start the API server:

```bash showLineNumbers
python3 src/app.py
```

## Test your application

Create a test script to call the API using an access token issued to the logged-in user. This simulates using a front-end application which can follow the same pattern to access backend APIs.

### 1. Create a test script
Create a file called `api_test.py` and add the following code to it:

```python showLineNumbers title="./api_test.py"
from dotenv import load_dotenv
import os
import requests
load_dotenv(dotenv_path=".env.local")

def get_access_token():
    url = f"https://{os.getenv('AUTH0_DOMAIN')}/oauth/token"
    headers = {"content-type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": os.getenv("AUTH0_CLIENT_ID"),
        "client_secret": os.getenv("AUTH0_CLIENT_SECRET"),
        "audience": os.getenv("AUTH0_API_AUDIENCE"),
    }
    response = requests.post(url, headers=headers, data=data)
    response.raise_for_status()  # Raise an error for bad responses
    return response.json().get("access_token")

def call_agent_api(access_token):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    payload = {
        "messages": [
            {"content": "Hello, tell me a joke.", "role": "Human"}
        ]
    }
    response = requests.post((os.getenv("APP_BASE_URL")+"/agent"), json=payload, headers=headers)
    response.raise_for_status()
    return response.json()

def main():
    try:
        token = get_access_token()
        print("Access token obtained successfully.")
        response = call_agent_api(token)
        print("Agent API Response:", response.get("response"))
    except requests.exceptions.RequestException as e:
        print("Error:", e)

if __name__ == "__main__":
    main()
```

### 2. Run your test script

To run your test script, enter the following command in a second terminal instance:

```bash showLineNumbers
python3 api_test.py
```

When you run the test script, the CLI app fetches an Auth0 token with `agent0-api` as the audience and uses it to call the `/agent` endpoint. If successful, it prints the AI agent's response.

  </Language>
</LanguageSelector>

## Next Steps

- To integrate third-party tool calling into your app, complete the <ArrowLink text="Call other's APIs on the user's behalf" href="call-others-apis-on-users-behalf" newTab={false}/> quickstart.
