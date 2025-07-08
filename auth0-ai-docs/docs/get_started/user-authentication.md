---
id: user-authentication
title: User Authentication
description: Learn how Auth for GenAI enables AI agents to seamlessly authenticate users.
slug: /user-authentication
sidebar_position: 6
hide_table_of_contents: true
---

import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import Card from "@site/src/components/Card";
import UserAuthPreReq from "@site/src/components/Quickstarts/UserAuthPreReq";
import EnvFileUserAuth from "@site/src/components/Quickstarts/EnvFile/envFileUserAuth";
import ArrowLink from "@site/src/components/ArrowLink";
import { QuickstartClientContextProvider } from "@site/src/components/Quickstarts/QuickstartClientContextProvider";

<QuickstartClientContextProvider>
# User Authentication

Authentication is the process of proving a user’s identity before granting them access to a resource. In this quickstart, you’ll learn how to bring [Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login) to your GenAI application and leverage OAuth 2.0 and OpenID Connect to securely authenticate users.

When a user authenticates with an identity provider through Auth0, Auth0 can pass user information in an ID token to an application or AI agent to deliver a personalized experience. For example, a chatbot can greet a user with their name and display relevant information based on the user's profile.

By the end of this quickstart, you should have an application that can:
- Sign up and log in using a username and password or a Google account.
- Authenticate and authorize users using OAuth 2.0 and OpenID Connect.

<LanguageSelector>
  <Language id="js" name="Next.js" icon="nextjs.svg">

<UserAuthPreReq />

<!--
<details>
<summary>Manually complete prerequisites</summary>
<p>

Before getting started, make sure you:

- Create a [free Auth0 account](http://auth0.com).
- Create a [Regular Web Application](https://manage.auth0.com/#/applications).

## Set up Auth0

Configure the application you just created with the required URLs within your tenant.

In the Auth0 Dashboard, navigate to **Applications > Applications** to select the web application you created. Under **Application URIs**, configure your callback and logout URLs.

### Configure callback URLs

A callback URL is a URL in your application that you would like Auth0 to redirect users to after they have authenticated. If not set, users will not be returned to your application after they log in.

```bash
http://localhost:3000/auth/callback
```

### Configure logout URLs

A logout URL is a URL in your application that you would like Auth0 to redirect users to after logging out. If not set, users cannot log out from your application and will receive an error.

```bash
http://localhost:3000
```

## Create Next.js app

Create a Next.js web application using Next.js version 15 or above. You can create a new application using [create-next-app](https://nextjs.org/docs/app/getting-started/installation).

```bash
npx create-next-app@15
```

## Create your environment file

In the root directory of your project, create the `.env.local` file and add the following environment variables:

```bash
# .env.local

AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
APP_BASE_URL='http://localhost:3000'
AUTH0_DOMAIN='<your-auth0-domain>'
AUTH0_CLIENT_ID='<your-auth0-application-client-id>'
AUTH0_CLIENT_SECRET='<your-auth0-application-client-secret>'
```

You can find your `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, and `AUTH0_CLIENT_SECRET` in the Auth0 Dashboard.

</p>
</details>
-->

## Create Next.js app

Create a Next.js web application using Next.js version 15 or above. You can create a new application using [create-next-app](https://nextjs.org/docs/app/getting-started/installation):

```bash showLineNumbers
npx create-next-app@15 --src-dir
```

## Install dependencies

In the root directory of your project, install the [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0):

```bash showLineNumbers
npm i @auth0/nextjs-auth0@4
```

## Add login to your application

Secure the application using the Auth0 Next.js SDK.

### 1. Create your environment file
In the root directory of your project, create the `.env.local` file and add the following variables. If you created an application with this quickstart, Auth0 automatically populates your environment variables for you:

Note: Your application’s client secret is masked for you. To get the client secret value, click the copy button on the code sample.

<EnvFileUserAuth />

### 2. Create the Auth0 client

Create a file at `src/lib/auth0.ts` and instantiate a new Auth0 client:

```ts showLineNumbers title="./src/lib/auth0.ts"
import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Create an Auth0 Client.
export const auth0 = new Auth0Client();
```

The Auth0 client provides methods for handling authentication, sessions, and user data.

### 3. Add the authentication middleware

The middleware intercepts incoming requests and applies Auth0's authentication logic. Create the following file at `src/middleware.ts`:

```ts showLineNumbers title="./src/middleware.ts"
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  // Authentication routes — let the Auth0 middleware handle it.
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return authRes;
  }

  const { origin } = new URL(request.url);
  const session = await auth0.getSession();

  // User does not have a session — redirect to login.
  if (!session) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }
  return authRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image, images (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - $ (root)
     */
    '/((?!_next/static|_next/image|images|favicon.[ico|png]|sitemap.xml|robots.txt|$).*)',
  ],
};
```
Update the `src/app/page.tsx` file to display content based on the user session:

```tsx showLineNumbers title="./src/app/page.tsx"
"use client";

import { useUser } from "@auth0/nextjs-auth0";

export default function Page() {
  // Extract the user object and loading state from Auth0.
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  // If no user, show sign-up and login buttons.
  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center h-screen p-10">
        <a href="/auth/login?screen_hint=signup">
          <button>Sign up</button>
        </a>
        <a href="/auth/login">
          <button>Log in</button>
        </a>
      </main>
    );
  }

  // If user exists, show a welcome message and logout button.
  return (
    <main className="flex flex-col items-center justify-center h-screen p-10">
      <h1>Welcome, {user.name}!</h1>
      <p>
        <a href="/auth/logout">
          <button>Log out</button>
        </a>
      </p>
    </main>
  );
}
```

The app displays the **Sign up** or **Log in** buttons without a user session. If a user session exists, the app displays a welcome message with the user's name and a Log out button.

## Run your application

Run this command to start your server:

```bash showLineNumbers
npm run dev
```

Visit the URL `http://localhost:3000` in your browser.

You will see:

![Auth0 login screen](/img/user_authentication_quickstart_login_screen.png)

- A **Sign up** and **Log in** button if the user is not authenticated.
- A welcome message and a **Log out** button if the user is authenticated.

Explore [the example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/authenticate-users/next-js).

<br />

  </Language>
  <Language id="python" name="FastAPI" icon="FastAPI.svg">

<UserAuthPreReq />

## Create Python app

Set up an interactive CLI application with FastAPI and the Auth0 Python SDK.

When creating a new Python app, use [Python version 3.11 and above.](https://www.python.org/downloads/).

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

## Add login to your application

Secure the application using the Auth0 Python SDK.

### 1. Create your environment file

In the root directory of your project, create the `.env.local` file and add the following variables. If you created an application with this quickstart, Auth0 automatically populates your environment variables for you:

Note: Your application’s client secret is masked for you. To get the client secret value, click the copy button on the code sample.

<EnvFileUserAuth />

To initialize your local Python environment, run the following commands in your terminal:

```bash showLineNumbers
python3 -m venv env
source env/bin/activate
```

### 2. Create the Auth0 client

Create a file at `src/app.py` and add the following code to instantiate a new Auth0 client.

When you initialize the Auth0 client, you need to specify additional authorization parameters to enable your application to retrieve access tokens for a supported identity provider:

| **Parameter** | **Description** |
|---------------|-----------|
| `scope`       | Requests the following Auth0 scopes to be authorized for the application:<p><ul><li>`openid`: (Required) Indicates that the application intends to use OIDC to verify the user's identity. To learn more read [OpenID connect scopes](https://auth0.com/docs/get-started/apis/scopes/openid-connect-scopes).</li><li>`profile`:  Returns claims that represent basic profile information, including `name`, `family_name`, `given_name`, `middle_name`, `nickname`, `picture`, and `updated_at`.</li><li>`email`: Returns the `email` claim, which contains the user's email address, and `email_verified`, which is a boolean indicating whether the email address was verified by the user.</li><li>`offline_access`: Requests an Auth0 refresh token from the Auth0 Authorization Server, which will be exchanged for a new access token from the requested connection's Token Vault. To learn more, read [Token Vault](https://auth0.com/docs/secure/tokens/token-vault).</li></ul></p> |

```python showLineNumbers title="./src/app.py"
# import dependencies
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

The Auth0 client provides methods for handling authentication, sessions, and user data.

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
print("Log in successful for:", user.get("name"))
print("-" * 25)
```

## Run your application
Run this command to start your server:

```bash showLineNumbers
python3 src/app.py
```

Visit the URL `http://localhost:3000` in your browser.

  </Language>
</LanguageSelector>

## Next steps

- To set up first-party tool calling, complete the <ArrowLink text="Call your APIs on user’s behalf" href="call-your-apis-on-users-behalf" newTab={false}/> quickstart.
- To set up third-party tool calling, complete the <ArrowLink text="Call other's APIs on user’s behalf" href="call-others-apis-on-users-behalf" newTab={false}/> quickstart.
- To explore the Auth0 Next.js SDK, see the <ArrowLink text="Github repo" href="https://github.com/auth0/nextjs-auth0"/>.

</QuickstartClientContextProvider>