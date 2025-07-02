# Docs > Get Started (Quickstarts landing page)

---

# Docs > Get Started > User Authentication (JS/Vercel)

---

# User Authentication

Authentication is the process of proving a user's identity before granting them access to a resource. In this quickstart, you'll learn how to bring [Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login) to your GenAI application and leverage OAuth 2.0 and OpenID Connect to securely authenticate users.

When a user authenticates with an identity provider through Auth0, Auth0 can pass user information in an ID token to an application or AI agent to deliver a personalized experience. For example, a chatbot can greet a user with their name and display relevant information based on the user's profile.

By the end of this quickstart, you should have an application that can:

- Sign up and log in using a username and password or a Google account.
- Authenticate and authorize users using OAuth 2.0 and OpenID Connect.

## Prerequisites

Before getting started, make sure you have completed the following steps:

- Create an Auth0 Account and a Dev Tenant
- Create and configure a [Regular Web Application](https://auth0.com/docs/get-started/applications) to use with this quickstart.

---

## Prepare Next.js app

Use a starter template or create a Next.js web application using Next.js version 15 or above.

**Recommended**: To use a starter template, clone the [Auth0 AI samples](https://github.com/auth0-samples/auth0-ai-samples) repository:

```bash
git clone https://github.com/auth0-samples/auth0-ai-samples.git
cd auth0-ai-samples/authenticate-users/next-js-starter
```

Else, create a new application using [create-next-app](https://nextjs.org/docs/app/getting-started/installation):

```bash
npx create-next-app@15 --src-dir
```

## Install dependencies

In the root directory of your project, install the [Auth0 Next.js SDK](http://next.js/):

```bash
npm i @auth0/nextjs-auth0@4
```

## Add login to your application

Secure the application using the Auth0 Next.js SDK.

### 1. Create your environment file

In the root directory of your project, create the `.env.local` file and add the following variables. If you created an application with this quickstart, Auth0 automatically populates your environment variables for you:

```env file=.env.local
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
APP_BASE_URL='http://localhost:3000'
AUTH0_DOMAIN='<your-auth0-domain>'
AUTH0_CLIENT_ID='<your-auth0-application-client-id>'
AUTH0_CLIENT_SECRET='<your-auth0-application-client-secret>'
```

### 2. Create the Auth0 client

Create a file at `src/lib/auth0.ts` and instantiate a new Auth0 client:

```ts file=src/lib/auth0.ts
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// Create an Auth0 Client.
export const auth0 = new Auth0Client();
```

The Auth0 client provides methods for handling authentication, sessions, and user data.

### 3. Add the authentication middleware

The middleware intercepts incoming requests and applies Auth0's authentication logic. Create the following file at `src/middleware.ts`:

```ts file=src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from './lib/auth0';

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  // Authentication routes — let the Auth0 middleware handle it.
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return authRes;
  }

  const { origin } = new URL(request.url);
  const session = await auth0.getSession(request);

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

### 4. Add Login and Sign up buttons

Update the `src/app/page.tsx` file to display content based on the user session:

```tsx file=src/app/page.tsx
//...
import { auth0 } from '@/lib/auth0';

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] my-auto gap-4">
        <h2 className="text-xl">You are not logged in</h2>
        <div className="flex gap-4">
          <Button asChild variant="default" size="default">
            <a href="/auth/login" className="flex items-center gap-2">
              <LogIn />
              <span>Login</span>
            </a>
          </Button>
          <Button asChild variant="default" size="default">
            <a href="/auth/login?screen_hint=signup">
              <UserPlus />
              <span>Sign up</span>
            </a>
          </Button>
        </div>
      </div>
    );
  }

  //... existing code

  // applicable only if you are using the starter template
  return (
    <ChatWindow
      endpoint="api/chat"
      emoji="🤖"
      placeholder={`Hello ${session?.user?.name}, I'm your personal assistant. How can I help you today?`}
      emptyStateComponent={InfoCard}
    />
  );
}
```

The app displays the **Sign up** or **Log in** buttons without a user session. If a user session exists, the app displays a welcome message with the user's name.

### 5. Add User Profile Dropdown (Optional)

If you are using the starter template, you can add a user profile dropdown to your application.

```tsx file=src/app/layout.tsx
//...
import { auth0 } from '@/lib/auth0';
import UserButton from '@/components/auth0/user-button';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      {/* ... existing code */}
      <body className={publicSans.className}>
        <NuqsAdapter>
          <div className="bg-secondary grid grid-rows-[auto,1fr] h-[100dvh]">
            <div className="grid grid-cols-[1fr,auto] gap-2 p-4 bg-black/25">
              {/* ... existing code */}
              <div className="flex justify-center">
                {session && (
                  <div className="flex items-center gap-2 px-4 text-white">
                    <UserButton user={session?.user!} logoutUrl="/auth/logout" />
                  </div>
                )}
                {/* ... existing code */}
              </div>
            </div>
            {/* ... existing code */}
          </div>
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
```

## Run your application

Run this command to start your server:

```bash
npm run dev
```

Visit the URL `http://localhost:3000` in your browser.

You will see:

- A **Sign up** and **Log in** button if the user is not authenticated.
- A welcome message and user profile dropdown if the user is authenticated.

Explore [the example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/authenticate-users/next-js).

## Next steps

- To set up first-party tool calling, complete the
  [Call your APIs on user's behalf](https://auth0.com/ai/docs/call-your-apis-on-users-behalf) quickstart.
- To set up third-party tool calling, complete the
  [Call other's APIs on user's behalf](https://auth0.com/ai/docs/call-others-apis-on-users-behalf) quickstart.
- To explore the Auth0 Next.js SDK, see the
  [Github repo](https://github.com/auth0/nextjs-auth0).
- [User Authentication for GenAI docs](https://auth0.com/ai/docs/user-authentication).

---

# Docs > Get Started > Call Your APIs on User's Behalf

---

# Call Your APIs On User's Behalf

Let your AI agent call your APIs on behalf of the authenticated user using access tokens securely issued by Auth0. Your API can be any [API that you have configured in Auth0](https://auth0.com/docs/get-started/apis).

By the end of this quickstart, you should have an application integrated with Auth0 and the [Vercel AI SDK](https://sdk.vercel.ai/docs) that can:

- Get an Auth0 access token.
- Use the Auth0 access token to make a tool call to your API endpoint, in this case, Auth0's `/userinfo` endpoint.
- Return the data to the user via an AI agent.

## Prerequisites

Before getting started, make sure you have completed the following steps:

- Create an Auth0 Account and a Dev Tenant
- Create and configure a [Regular Web Application](https://auth0.com/docs/get-started/applications) to use with this quickstart.
- Complete the [User Authentication quickstart](https://auth0.com/ai/docs/user-authentication) or download a starter template.
- Set up an [OpenAI account and API key](https://platform.openai.com/docs/libraries#create-and-export-an-api-key)

## Prepare Next.js app

**Recommended**: To use a starter template, clone the [Auth0 AI samples](https://github.com/auth0-samples/auth0-ai-samples) repository:

```bash
git clone https://github.com/auth0-samples/auth0-ai-samples.git
cd auth0-ai-samples/authenticate-users/next-js
```

## Install dependencies

In the root directory of your project, install the following dependencies:

- `ai`: Core [Vercel AI SDK](https://sdk.vercel.ai/docs) module that interacts with various AI model providers.
- `@ai-sdk/openai`: [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) provider for the Vercel AI SDK.
- `@ai-sdk/react`: [React](https://react.dev/) UI components for the Vercel AI SDK.
- `zod`: TypeScript-first schema validation library.

```bash
npm install ai@4 @ai-sdk/openai@1 @ai-sdk/react@1 zod@3
```

## Define a tool to call your API

In this step, you'll create a Vercel AI tool to make the first-party API call. The tool fetches an access token to call the API.

In this example, after taking in an Auth0 access token during user login, the tool returns the user profile of the currently logged-in user by calling the [/userinfo](https://auth0.com/docs/api/authentication/user-profile/get-user-info) endpoint.

```ts file=src/lib/tools/user-info.ts
import { tool } from 'ai';
import { z } from 'zod';

import { auth0 } from '../auth0';

export const getUserInfoTool = tool({
  description: 'Get information about the current logged in user.',
  parameters: z.object({}),
  execute: async () => {
    const session = await auth0.getSession();
    if (!session) {
      return 'There is no user logged in.';
    }

    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
      },
    });

    if (response.ok) {
      return { result: await response.json() };
    }

    return "I couldn't verify your identity";
  },
});
```

## Add the tool to the AI agent

The AI agent processes and runs the user's request through the AI pipeline, including the tool call. Vercel AI simplifies this task with the `streamText()` method. Update the `/src/app/api/chat/route.ts` file with the following code:

```ts file=src/app/api/chat/route.ts
//...
import { getUserInfoTool } from '@/lib/tools/user-info';

//... existing code

export async function POST(req: NextRequest) {
  const { id, messages }: { id: string; messages: Array<Message>; selectedChatModel: string } = await req.json();

  const tools = {
    getUserInfoTool,
  };

  return createDataStreamResponse({
    execute: async (dataStream: DataStreamWriter) => {
      const result = streamText({
        model: openai('gpt-4o-mini'),
        system: AGENT_SYSTEM_TEMPLATE,
        messages,
        maxSteps: 5,
        tools,
      });

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: (err: unknown) => {
      console.log(err);
      return 'Oops, an error occured!';
    },
  });
}
```

You need an API Key from Open AI or another provider to use an LLM. Add that API key to your `.env.local` file:

```env file=.env.local
# ...
# You can use any provider of your choice supported by Vercel AI
OPENAI_API_KEY="YOUR_API_KEY"
```

If you use another provider for your LLM, adjust the variable name in `.env.local` accordingly.

## Test your application

To test the application, run `npm run dev` and navigate to `http://localhost:3000` and interact with the AI agent. You can ask questions like `"who am I?"` to trigger the tool call and test whether it successfully retrieves information about the logged-in user.

```
User: who am I?
AI: It seems that there is no user currently logged in. If you need assistance with anything else, feel free to ask!

User: who am I?
AI: You are Deepu Sasidharan. Here are your details: - .........
```

That's it! You've successfully integrated first-party tool-calling into your project.

Explore [the example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/call-your-apis/next-js).

## Next steps

- To set up third-party tool calling, complete the
  [Call other's APIs on user's behalf](https://auth0.com/ai/docs/call-others-apis-on-users-behalf) quickstart.
- To explore the Auth0 Next.js SDK, see the
  [Github repo](https://github.com/auth0/nextjs-auth0).
- [Call your APIs on user's behalf docs](https://auth0.com/ai/docs/call-your-apis-on-users-behalf).

---

# Docs > Get Started > Call Others' APIs on User's Behalf

---

# Call Other's APIs on User's Behalf

Use Auth0 SDKs to fetch access tokens for social and enterprise identity providers from Auth0's [Token Vault](https://auth0.com/docs/secure/tokens/token-vault). Using these access tokens, AI agents integrated with the application can call third-party APIs to perform tasks on the user's behalf.

By the end of this quickstart, you should have an application integrated with Auth0 and the [Vercel AI SDK](https://sdk.vercel.ai/docs) that can:

1. Retrieve access tokens for a Google social connection.
2. Integrate with an AI agent to call Google Calendar APIs.

## Prerequisites

Before getting started, make sure you have completed the following steps:

- Create an Auth0 Account and a Dev Tenant
- Create and configure a [Regular Web Application](https://auth0.com/docs/get-started/applications) to use with this quickstart.
- Complete the [User Authentication quickstart](https://auth0.com/ai/docs/user-authentication) or download a starter template.
- Configure Google Social Connection (see [Google Sign-in and Authorization](https://auth0.com/ai/docs/google-sign-in-and-auth)) and select the Calender scope.
- Set up an [OpenAI account and API key](https://platform.openai.com/docs/libraries#create-and-export-an-api-key)

## Prepare Next.js app

**Recommended**: To use a starter template, clone the [Auth0 AI samples](https://github.com/auth0-samples/auth0-ai-samples) repository:

```bash
git clone https://github.com/auth0-samples/auth0-ai-samples.git
cd auth0-ai-samples/authenticate-users/next-js
```

## Install dependencies

In the root directory of your project, install the following dependencies:

- `@auth0/ai-vercel`: [Auth0 AI SDK for Vercel AI](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-vercel) built for GenAI applications powered by the Vercel AI SDK.
- `ai`: Core [Vercel AI SDK](https://sdk.vercel.ai/docs) module that interacts with various AI model providers.
- `@ai-sdk/openai`: [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) provider for the Vercel AI SDK.
- `@ai-sdk/react`: [React](https://react.dev/) UI components for the Vercel AI SDK.
- `zod`: TypeScript-first schema validation library.
- `googleapis`: Node.js client for Google APIs that supports authentication and authorization with OAuth 2.0.

```bash
npm install @auth0/ai-vercel@3 ai@4 @ai-sdk/openai@1 @ai-sdk/react@1 zod@3 googleapis@148
```

## Get access tokens for other APIs

Use the [Auth0 AI SDK](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-vercel) to get access tokens for third-party APIs.

### 1. Set up Token Vault for Google Social Connection

Setup Auth0 AI SDK for Google Social Connection. This will allow you to get access tokens for Google Social Connection using [Token Vault](https://auth0.com/docs/secure/tokens/token-vault).

- `connection`: pass in the name of the connection you want the user to sign up for/log into.
- `refreshToken`: pass in the function to get the refresh token from the current session.
- `scopes`: pass in the scopes for the service you want to get access to.

Create a file at `src/lib/auth0-ai.ts` and instantiate a new Auth0 AI SDK client:

```tsx file=src/lib/auth0-ai.ts
import { Auth0AI, getAccessTokenForConnection } from '@auth0/ai-vercel';
import { getRefreshToken } from './auth0';

// Get the access token for a connection via Auth0
export const getAccessToken = async () => getAccessTokenForConnection();

const auth0AI = new Auth0AI();

// Connection for Google services
export const withGoogleConnection = auth0AI.withTokenForConnection({
  connection: 'google-oauth2',
  scopes: ['https://www.googleapis.com/auth/calendar.events'],
  refreshToken: getRefreshToken,
});
```

Update the `/src/lib/auth0.ts` file with the following code:

```tsx file=src/lib/auth0.ts
//...
//... existing code
// Get the refresh token from Auth0 session
export const getRefreshToken = async () => {
  const session = await auth0.getSession();
  return session?.tokenSet?.refreshToken;
};
```

### 2. Use access token to call APIs from a tool

Once the user is authenticated, you can fetch an access token from the Token Vault using the Auth0 AI SDK. In this example, we fetch an access token for a Google social connection. Once you've obtained the access token for a social connection, you can use it with an AI agent to fetch data during a tool call and provide contextual data in its response.

In our example, we create a file at `src/lib/tools/google-calendar.ts`. In the file, we define a tool, `checkUsersCalendarTool`, that uses the access token with the Google Calendar API to query for calendar events in a specified date range:

```ts file=src/lib/tools/google-calendar.ts
import { tool } from 'ai';
import { addHours, formatISO } from 'date-fns';
import { GaxiosError } from 'gaxios';
import { google } from 'googleapis';
import { z } from 'zod';
import { FederatedConnectionError } from '@auth0/ai/interrupts';

import { getAccessToken, withGoogleConnection } from '../auth0-ai';

export const checkUsersCalendarTool = withGoogleConnection(
  tool({
    description: 'Check user availability on a given date time on their calendar',
    parameters: z.object({
      date: z.coerce.date(),
    }),
    execute: async ({ date }) => {
      // Get the access token from Auth0 AI
      const accessToken = await getAccessToken();

      // Google SDK
      try {
        const calendar = google.calendar('v3');
        const auth = new google.auth.OAuth2();

        auth.setCredentials({
          access_token: accessToken,
        });

        const response = await calendar.freebusy.query({
          auth,
          requestBody: {
            timeMin: formatISO(date),
            timeMax: addHours(date, 1).toISOString(),
            timeZone: 'UTC',
            items: [{ id: 'primary' }],
          },
        });

        return {
          available: response.data?.calendars?.primary?.busy?.length === 0,
        };
      } catch (error) {
        if (error instanceof GaxiosError) {
          if (error.status === 401) {
            throw new FederatedConnectionError(`Authorization required to access the Federated Connection`);
          }
        }

        throw error;
      }
    },
  }),
);
```

You need to [obtain an API Key from OpenAI](https://platform.openai.com/api-keys) or another provider to use an LLM. Add the API key to your environment variables:

```env
# ...
# You can use any provider of your choice supported by Vercel AI
OPENAI_API_KEY="YOUR_API_KEY"
```

### 3. Add step up authorization

Now when you try to use the tool, you will need to authorize additional scopes for Google that you have configured. We can achieve this using step up authorization.

Install Auth0 AI Components for Next.js to get the required UI components.

```bash
npx @auth0/ai-components add FederatedConnections
```

Add a new file, `src/components/auth0-ai/FederatedConnections/FederatedConnectionInterruptHandler.tsx` and add the following code:

```tsx file=src/components/auth0-ai/FederatedConnections/FederatedConnectionInterruptHandler.tsx
import { FederatedConnectionInterrupt } from '@auth0/ai/interrupts';
import type { Auth0InterruptionUI } from '@auth0/ai-vercel/react';

import { EnsureAPIAccess } from '@/components/auth0-ai/FederatedConnections';

interface FederatedConnectionInterruptHandlerProps {
  interrupt: Auth0InterruptionUI | null;
}

export function FederatedConnectionInterruptHandler({ interrupt }: FederatedConnectionInterruptHandlerProps) {
  if (!FederatedConnectionInterrupt.isInterrupt(interrupt)) {
    return null;
  }

  return (
    <div key={interrupt.name} className="whitespace-pre-wrap">
      <EnsureAPIAccess
        mode="popup"
        interrupt={interrupt}
        connectWidget={{
          title: 'Authorization Required.',
          description: interrupt.message,
          action: { label: 'Authorize' },
        }}
      />
    </div>
  );
}
```

Now update the `src/components/ChatWindow.tsx` file to include the FederatedConnectionInterruptHandler component:

```tsx file=src/components/ChatWindow.tsx
//...
import { useInterruptions } from '@auth0/ai-vercel/react';
import { FederatedConnectionInterruptHandler } from '@/components/auth0-ai/FederatedConnectionInterruptHandler';


//... existing code
export function ChatWindow(props: {
  //... existing code
}) {
  const chat = useInterruptions((handler) =>
    useChat({
      api: props.endpoint,
      onError: handler((e: Error) => {
        console.error('Error: ', e);
        toast.error(`Error while processing your request`, { description: e.message });
      }),
    }),
  );

  //... existing code
  return (
    <StickToBottom>
      <StickyToBottomContent
        className="absolute inset-0"
        contentClassName="py-8 px-2"
        content={
          chat.messages.length === 0 ? (
            <div>{props.emptyStateComponent}</div>
          ) : (
            <>
              <ChatMessages
                aiEmoji={props.emoji}
                messages={chat.messages}
                emptyStateComponent={props.emptyStateComponent}
              />
              <div className="flex flex-col max-w-[768px] mx-auto pb-12 w-full">
                <FederatedConnectionInterruptHandler interrupt={chat.toolInterrupt} />
              </div>
            </>
          )
        }
        {/* ... existing code */}
      ></StickyToBottomContent>
    </StickToBottom>
  );
}
```

### 4. Add the tool to the AI agent

Handle the interrupts from the Agent and call the tool from your AI app to get calendar events. Update the `/src/app/api/chat/route.ts` file with the following code:

```ts file=src/app/api/chat/route.ts
//...
import { setAIContext } from '@auth0/ai-vercel';
import { errorSerializer, withInterruptions } from '@auth0/ai-vercel/interrupts';
import { checkUsersCalendarTool } from '@/lib/tools/google-calender';
//... existing code

export async function POST(req: NextRequest) {
  const { id, messages }: { id: string; messages: Array<Message>; selectedChatModel: string } = await req.json();

  setAIContext({ threadID: id });

  const tools = {
    checkUsersCalendarTool,
  };

  return createDataStreamResponse({
    execute: withInterruptions(
      async (dataStream: DataStreamWriter) => {
        const result = streamText({
          model: openai('gpt-4o-mini'),
          system: AGENT_SYSTEM_TEMPLATE,
          messages,
          maxSteps: 5,
          tools,
        });

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      {
        messages,
        tools,
      },
    ),
    onError: errorSerializer((err: any) => {
      console.log(err);
      return `An error occurred! ${err.message}`;
    }),
  });
}
```

## Test your application

Start the application with `npm run dev`. Then, navigate to `http://localhost:3000`. If you have already logged in, make sure to log out and log in again using Google. Then, ask your AI Agent a question about your calendar!

That's it! You successfully integrated external tool-calling into your project.

Explore [the example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/call-others-apis/next-js).

## Next steps

- Learn more about Client-initiated account linking
- Learn more about how Auth0's Token Vault
- [Call your APIs on user's behalf docs](https://auth0.com/ai/docs/call-your-apis-on-users-behalf).

---

# Docs > Get Started > Asynchronous Authorization

---

# Asynchronous Authorization

Auth for GenAI enables AI agents to asynchronously authorize users using the [Client-Initiated Backchannel Authentication Flow (CIBA)](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow). AI agents can work in the background, only notifying the user when needed for critical actions.

When you add secure [human-in-the-loop approvals](https://sdk.vercel.ai/cookbook/next/human-in-the-loop) to your AI agent workflows, you can use Auth0 to request the user's permission to complete an authorization request. The AI agent can render [rich authorization data](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow/user-authorization-with-ciba) in the consent prompt so the user knows exactly what they're authorizing.

By the end of this quickstart, you should have an AI agent integrated with the [Auth0 AI SDK](https://github.com/auth0-lab/auth0-ai-js) that can request to buy products from an online shop on the user's behalf.

## Prerequisites

Before getting started, make sure you have completed the following steps:

- Create an Auth0 Account and a Dev Tenant
- Create and configure a [Regular Web Application](https://auth0.com/docs/get-started/applications) to use with this quickstart.
- [Enable Guardian Push](https://auth0.com/docs/secure/multi-factor-authentication/auth0-guardian) (Multi-factor authentication with Guardian Push Notifications) for your Auth0 tenant.
- [Enroll your user to use Auth0 Guardian](https://auth0.com/docs/mfa/auth0-guardian/user-enrollment)
- Complete the [User Authentication quickstart](https://auth0.com/ai/docs/user-authentication) or download a starter template.
- Set up an [OpenAI account and API key](https://platform.openai.com/docs/libraries#create-and-export-an-api-key)

## Prepare Next.js app

**Recommended**: To use a starter template, clone the [Auth0 AI samples](https://github.com/auth0-samples/auth0-ai-samples) repository:

```bash
git clone https://github.com/auth0-samples/auth0-ai-samples.git
cd auth0-ai-samples/authenticate-users/next-js
```

## Install dependencies

In the root directory of your project, install the following dependencies:

- `@auth0/ai-vercel`: [Auth0 AI SDK for Vercel AI](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-vercel) built for GenAI applications powered by the Vercel AI SDK.
- `ai`: Core [Vercel AI SDK](https://sdk.vercel.ai/docs) module that interacts with various AI model providers.
- `@ai-sdk/openai`: [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) provider for the Vercel AI SDK.
- `@ai-sdk/react`: [React](https://react.dev/) UI components for the Vercel AI SDK.
- `zod`: TypeScript-first schema validation library.

```bash
npm install @auth0/ai-vercel@3 ai@4 @ai-sdk/openai@1 @ai-sdk/react@1 zod@3
```

## Setup Human in the Loop Approvals

Integrate the Auth0 AI SDK into your application to secure your async AI agent workflow. For quickstart we will use a blocking request flow. In real use cases, often an asynchronous flow is preferred.

### 1. Configure the Auth0 AI SDK

To require asynchronous authorization for your tool, the tool needs to be wrapped with the Async authorizer, `withAsyncUserConfirmation()`. Let's create a helper function to wrap the tool with the Async authorizer.

Create a file at `src/lib/auth0-ai.ts` and instantiate a new Auth0 AI SDK client:

```tsx file=src/lib/auth0-ai.ts
import { Auth0AI } from '@auth0/ai-vercel';
import { AccessDeniedInterrupt } from '@auth0/ai/interrupts';

import { getUser } from './auth0';

const auth0AI = new Auth0AI();

// CIBA flow for user confirmation
export const withAsyncAuthorization = auth0AI.withAsyncUserConfirmation({
  userID: async () => {
    const user = await getUser();
    return user?.sub as string;
  },
  bindingMessage: async ({ product, qty }) => `Do you want to buy ${qty} ${product}`,
  scopes: ['openid', 'product:buy'], // add any scopes you want to use with your API
  audience: process.env['AUDIENCE']!,

  /**
   * When this flag is set to `block`, the execution of the tool awaits
   * until the user approves or rejects the request.
   *
   * Given the asynchronous nature of the CIBA flow, this mode
   * is only useful during development.
   *
   * In practice, the process that is awaiting the user confirmation
   * could crash or timeout before the user approves the request.
   */
  onAuthorizationRequest: 'block',
  onUnauthorized: async (e: Error) => {
    if (e instanceof AccessDeniedInterrupt) {
      return 'The user has denied the request';
    }
    return e.message;
  },
});
```

This will intercept the tool call to initiate a CIBA request:

- The CIBA request includes the user ID that will approve the request.
- Auth0 sends the user a mobile push notification. The AI agent polls the `/token` endpoint for a user response.
- The mobile application retrieves the `bindingMessage` containing the consent details, in this case, the details of the product to purchase.
- The user responds to the request:
  - If the request is approved, the tool execution will continue.
  - If the request is rejected, the tool execution will not continue.

![CIBA flow](https://user-images.githubusercontent.com/10214025/233876208-c8d5d0e2-e7c4-4f0a-a1c1-b0d1d4d2f1f9.png)

Next, add the following code to `src/lib/auth0.ts`:

```tsx file=src/lib/auth0.ts
//... existing code
export const getUser = async () => {
  const session = await auth0.getSession();
  return session?.user;
};
```

### 2. Require async authorization for your tool

In this example, we wrap a tool that buys products on the user's behalf. When the user approves the transaction, the Auth0 AI SDK retrieves an access token to call the shop's API. Upon completing the CIBA flow, the AI agent responds with a message confirming the purchase.

The Auth0 AI SDK returns an error response if the user denies the transaction.

Now, create and wrap the tool with the Async authorizer. Create a file `src/lib/tools/shop-online.ts` and add the following code:

```ts file=src/lib/tools/shop-online.ts
import { tool } from 'ai';
import { z } from 'zod';

import { getCIBACredentials } from '@auth0/ai-vercel';
import { withAsyncAuthorization } from '../auth0-ai';

export const shopOnlineTool = withAsyncAuthorization(
  tool({
    description: 'Tool to buy products online',
    parameters: z.object({
      product: z.string(),
      qty: z.number(),
      priceLimit: z.number().optional(),
    }),
    execute: async ({ product, qty, priceLimit }) => {
      console.log(`Ordering ${qty} ${product} with price limit ${priceLimit}`);

      const apiUrl = process.env['SHOP_API_URL']!;

      if (!apiUrl) {
        // No API set, mock a response or return error
        return `Ordered ${qty} ${product}`;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: '',
      };
      const body = {
        product,
        qty,
        priceLimit,
      };

      const credentials = getCIBACredentials();
      const accessToken = credentials?.accessToken;

      if (accessToken) {
        headers['Authorization'] = 'Bearer ' + accessToken;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });

      return response.statusText;
    },
  }),
);
```

### 3. Update environment variables

You need to [obtain an API Key from OpenAI](https://platform.openai.com/api-keys) or another provider to use an LLM.

If you want to use an API, it must be [registered with Auth0](https://auth0.com/docs/get-started/apis) and have a valid audience.

Update the `.env.local` file with the following variables:

```env file=.env.local
# ... existing variables
# You can use any provider of your choice supported by Vercel AI
OPENAI_API_KEY="YOUR_API_KEY"

# API
SHOP_API_URL=<your-shop-api-url>
AUDIENCE=sample-shop-api
```

### 4. Integrate the tool into an AI agent

Call the tool from your AI app to make purchases. Update the `/src/app/api/chat/route.ts` file with the following code:

```ts file=src/index.ts
//...
import { setAIContext } from '@auth0/ai-vercel';

import { shopOnlineTool } from '@/lib/tools/shop-online';

//...
export async function POST(req: NextRequest) {
  const { id, messages }: { id: string; messages: Array<Message>; selectedChatModel: string } = await req.json();

  setAIContext({ threadID: id });

  const tools = {
    shopOnlineTool,
  };

  return createDataStreamResponse({
    execute: async (dataStream: DataStreamWriter) => {
      const result = streamText({
        model: openai('gpt-4o-mini'),
        system: AGENT_SYSTEM_TEMPLATE,
        messages,
        maxSteps: 5,
        tools,
      });

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: (err: unknown) => {
      console.log(err);
      return 'Oops, an error occured!';
    },
  });
}
```

## Test the application

Start the application with `npm run dev`. Then, navigate to `http://localhost:3000`.

Now ask the AI agent to buy a product, for example, "Buy an XYZ phone". Now, look for a push notification from the [Auth0 Guardian app](https://auth0.com/docs/mfa/auth0-guardian/user-enrollment) or your custom app integrated with the Auth0 Guardian SDK on your mobile device. Once you approve the notification, you should see the tool being executed and a response from the Agent.

Explore the [example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/async-authorization/vercel-ai-next-js).

## Next steps

- Async Authorization docs
- Learn more about the [Client-Initiated Backchannel Authentication Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow).
- Learn how to [Configure Rich Authorization Requests](https://auth0.com/docs/get-started/apis/configure-rich-authorization-requests).

---

# Docs > Get Started > Authorization for RAG

---

# Authorization for RAG

Auth for GenAI leverages [Auth0 FGA](https://auth0.com/fine-grained-authorization) to provide fine-grained authorization control for AI agents. As a result, when AI agents use Retrieval Augmented Generation (RAG) to provide sophisticated, relevant responses to user queries, they only have access to authorized data.

By the end of this quickstart, you should have a Next.js application that can:

1. Retrieve authorized data as context for a RAG pipeline using Vercel AI.
2. Use Auth0 FGA to determine if the user has authorization for the data.

## Prerequisites

Before getting started, make sure you:

- [Create an Auth0 FGA account](https://dashboard.fga.dev/)
- Complete the [User Authentication quickstart](https://auth0.com/ai/docs/user-authentication) or download a starter template.
- [Set up an OpenAI account and API key](https://platform.openai.com/)

## Prepare Next.js app

**Recommended**: To use a starter template, clone the [Auth0 AI samples](https://github.com/auth0-samples/auth0-ai-samples) repository:

```bash
git clone https://github.com/auth0-samples/auth0-ai-samples.git
cd auth0-ai-samples/authorization-for-rag/vercel-ai-next-js-starter
```

## Install dependencies

In the root directory of your project, install the following dependencies:

- `@auth0/ai-vercel`: [Auth0 AI SDK for Vercel AI](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-vercel) built for GenAI applications powered by the Vercel AI SDK.
- `ai`: Core [Vercel AI SDK](https://sdk.vercel.ai/docs) module that interacts with various AI model providers.
- `@ai-sdk/openai`: [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) provider for the Vercel AI SDK.
- `@ai-sdk/react`: [React](https://react.dev/) UI components for the Vercel AI SDK.
- `zod`: TypeScript-first schema validation library.

```bash
npm install @auth0/ai-vercel@3 ai@4 @ai-sdk/openai@1 @ai-sdk/react@1 zod@3
```

## Set up an FGA Store

In the [Auth0 FGA dashboard](https://dashboard.fga.dev/):

1. Navigate to **Settings**. In the **Authorized Clients** section, click **+ Create Client**.
2. Give your client a name and mark all the client permissions that are required for your use case. For the quickstart you'll only need **Read and query**.
3. Click **Create**.

![FGA Client](/public/images/fga-client.png)

Once your client is created, you'll see a modal containing Store ID, Client ID, and Client Secret. Add an `.env.local` file with the following content to the root directory of the project. Click **Continue** to see the `FGA_API_URL` and `FGA_API_AUDIENCE`.

```env file=.env.local
# You can use any provider of your choice supported by Vercel AI
OPENAI_API_KEY=<your-openai-api-key>

# Auth0 FGA
FGA_STORE_ID=<your-fga-store-id>
FGA_CLIENT_ID=<your-fga-store-client-id>
FGA_CLIENT_SECRET=<your-fga-store-client-secret>
FGA_API_URL=https://api.xxx.fga.dev
FGA_API_AUDIENCE=https://api.xxx.fga.dev/
```

Next, navigate to **Model Explorer**. Update the model information with this:

```
model
  schema 1.1

type user

type doc
  relations
    define owner: [user]
    define viewer: [user, user:*]
    define can_view: owner or viewer
```

Remember to click **Save**.

## Secure the RAG Tool

After all this configuration, secure the RAG tool using Auth0 FGA and Auth0 AI SDK.

The starter application is already configured to handle documents and embeddings.

**Document Upload and Storage**

- You can upload documents through the UI (`src/app/documents/page.tsx`)
- Uploaded documents are processed by the API route (`src/app/api/documents/upload/route.ts`)
- APIs for uploading and retrieving documents are defined in (`src/lib/actions/documents.ts`).
- Database is defined in `src/lib/db`
- FGA helpers are defined in `src/lib/fga`
- Documents are stored as embeddings in a vector database for efficient retrieval (`src/lib/rag/embedding.ts`).

**Access Control with Auth0 FGA**

- When a document is uploaded, the app automatically creates [FGA tuples](https://docs.fga.dev/fga-concepts#what-is-a-relationship-tuple) to define which users can access which documents. A tuple signifies a user's relation to a given object. For example, the below tuple implies that all users can view the `<document name>` object.
- Navigate to the **Tuple Management** section to see the tuples being added. If you want to add a tuple manually for a document, click **+ Add Tuple**. Fill in the following information:
  - **User**: `user:*`
  - **Object**: select doc and add `<document name>` in the ID field
  - **Relation**: `viewer`

### 1. Create a RAG tool

Define a RAG tool that uses the `FGAFilter` to filter authorized data from the vector database.

```tsx file=src/lib/tools/context-docs.ts
import { tool } from 'ai';
import { z } from 'zod';
import { FGAFilter } from '@auth0/ai';

import { findRelevantContent } from '@/lib/rag/embedding';
import { auth0 } from '../auth0';

export type DocumentWithScore = {
  content: string;
  documentId: string;
  similarity: number;
};

export const getContextDocumentsTool = tool({
  description:
    'Use the tool when user asks for documents or projects or anything that is stored in the knowledge base.',
  parameters: z.object({
    question: z.string().describe('the users question'),
  }),
  execute: async ({ question }) => {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user) {
      return 'There is no user logged in.';
    }

    const retriever = FGAFilter.create({
      buildQuery: (doc: DocumentWithScore) => ({
        user: `user:${user?.email}`,
        object: `doc:${doc.documentId}`,
        relation: 'can_view',
      }),
    });

    const documents = await findRelevantContent(question, 25);
    // filter docs based on FGA authorization
    const context = await retriever.filter(documents);
    return context;
  },
});
```

### 2. Use the RAG tool from AI agent

Call the tool from your AI agent to get data from documents. Update the `/src/app/api/chat/route.ts` file with the following code:

```ts file=src/app/api/chat/route.ts
//...
import { getContextDocumentsTool } from '@/lib/tools/context-docs';

//... existing code
export async function POST(req: NextRequest) {
  //... existing code
  const tools = {
    getContextDocumentsTool,
  };

  return createDataStreamResponse({
    execute: async (dataStream: DataStreamWriter) => {
      const result = streamText({
        model: openai('gpt-4o-mini'),
        system: AGENT_SYSTEM_TEMPLATE,
        messages,
        maxSteps: 5,
        tools,
      });

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: (err: any) => {
      console.log(err);
      return `An error occurred! ${err.message}`;
    },
  });
}
```

## Test your application

Start the application with `npm run dev`. Then, navigate to `http://localhost:3000`.
Upload a document from the documents tab and ask your AI Agent a question about the document! You should get a response with the relevant information. Now go to an incognito window and log in as a different user and try to ask the same question. You should not get a response. Now try sharing the document from the documents page to the second user and try again. You should see the information now.

That's it! You successfully integrated RAG protected by AUth0 FGA into your project.

Explore [the example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/authorization-for-rag/vercel-ai-next-js).

## Next steps

- [Learn how to use Auth0 FGA to create a Relationship-Based Access Control (ReBAC) authorization model.](https://auth0.com/fine-grained-authorization)
- [Learn more about OpenFGA](https://openfga.dev/docs/fga)
