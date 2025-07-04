---
id: asynchronous-authorization
title: Asynchronous Authorization
description: Learn how Auth for GenAI enables AI agents to asynchronously authorize users.
slug: /async-authorization
sidebar_position: 9
hide_table_of_contents: true
---

import AsyncUserConfirmPreReq from "@site/src/components/Quickstarts/AsyncUserConfirmPreReq";
import EnvFileAsyncUserConfirm from "@site/src/components/Quickstarts/EnvFile/envFileAsyncUserConfirm";
import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import ArrowLink from "@site/src/components/ArrowLink";
import { QuickstartClientContextProvider } from "@site/src/components/Quickstarts/QuickstartClientContextProvider";

<QuickstartClientContextProvider>
# Asynchronous Authorization

Auth for GenAI enables AI agents to asynchronously authorize users using the [Client-Initiated Backchannel Authentication Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow). AI agents can work in the background, only notifying the user when needed for critical actions.

When you add secure [human-in-the-loop approvals](https://sdk.vercel.ai/cookbook/next/human-in-the-loop) to your AI agent workflows, you can use Auth0 to request the user's permission to complete an authorization request. The AI agent can render [rich authorization data](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow/user-authorization-with-ciba) in the consent prompt so the user knows exactly what they’re authorizing.

<!--emphasize it's agents working in the background-->
By the end of this quickstart, you should have an AI agent integrated with the [Auth0 AI SDK](https://github.com/auth0-lab/auth0-ai-js) that can request to buy stock on the user's behalf.

:::note

We value your feedback! To ask questions, report issues, or request new frameworks and providers, connect with us on [GitHub](https://github.com/auth0/auth-for-genai).

:::

<LanguageSelector>
  <Language id="js" name="Node.js" icon="js-clean.svg">
    <!--Next.js picker-->

  <AsyncUserConfirmPreReq />

  <!--update Enroll your user to use Auth0 Guardian prereq: make it more clear that the user is enrolled, wrong screenshot, current one is more in enable Guardian-->

## Install dependencies

Install the following dependencies:

- `ai`: Core [Vercel AI SDK](https://sdk.vercel.ai/docs) module that interacts with various AI model providers.
- `zod`: TypeScript-first schema validation library.
- `dotenv`: A module that loads environment variables from a `.env` file.
- `auth0`: Auth0 [Node.js](http://node.js) library.
- `@ai-sdk/openai`: [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) provider for the [Vercel AI SDK](https://sdk.vercel.ai/docs).
- `@auth0/ai-vercel`: [Auth0 AI SDK for Vercel AI](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-vercel) built for GenAI applications powered by the Vercel AI SDK. <!--if we're using AI framework we should use it in others-->

```bash showLineNumbers title="Create a new Node.js project"
npm init -y
npm i auth0@4 @auth0/ai-vercel@2 zod@3 ai@4 @ai-sdk/openai@1 dotenv@16
```

Add the below to `package.json`:

```json showLineNumbers title="package.json"
"main": "index.js",
"x-type": "module",
"scripts": {
  "start": "npx tsx src/index.ts"
},
```
<!--
## Enable Asynchronous authorization for your application

Asynchronous authorization builds on the [Client Initiated Backchannel Authentication (CIBA)](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow) open standard and needs to be enabled in your Auth0 application.

### 1. Configure CIBA for your application

You can configure CIBA for your application with the [Auth0 Dashboard](https://manage.auth0.com/) or the [Auth0 Management API](https://auth0.com/docs/api/management/v2).

To configure CIBA for your application with the Auth0 Dashboard:

1. Navigate to **Applications > Applications**.
2. Choose the Machine-to-Machine application you want to use.
3. Under **Advanced Settings > Grant Types**, enable the **Client Initiated Backchannel Authentication (CIBA)** grant type:
4. Click **Save Changes**.

### 2. Enable Auth0 to send push notifications

You must activate push notifications through the Auth0 Guardian mobile app to notify your users about incoming authorization requests.

In the Auth0 Dashboard:
1. Select **Security > Multi-factor Auth**.
2. Enable **Push Notification using Auth0 Guardian**. This may require some MFA configuration settings. To learn more, read [Configure Push Notifications for MFA](https://auth0.com/docs/secure/multi-factor-authentication/multi-factor-authentication-factors/configure-push-notifications-for-mfa).
3. Click **Save Changes**.

### 1. Enroll your user to use Auth0 Guardian why is this not a prereq, this is duplicated

To initiate a CIBA push request, the authorizing user must be enrolled in MFA using push notifications. To verify in the Auth0 Dashboard, navigate to **User Management > Users** and click on the user:

![Enroll user to use Auth0 Guardian](/img/enroll_user_in_guardian.png)

If the user is not enrolled, you can send an enrollment request by email.

![Send enrollment notification](/img/send_enrollment_notification.png)-->

## Integrate Auth0 AI SDK

Integrate the [Auth0 AI SDK](https://github.com/auth0-lab/auth0-ai-js) into your application to secure your async AI agent workflow.

### 1. Create your environment file
In the root directory of your project, create the `.env` file and add the following variables. If you created an application with this quickstart, Auth0 automatically populates your environment variables for you:

:::note
Your application’s client secret is masked for you. To get the client secret value, click the copy button on the code sample.
:::

<EnvFileAsyncUserConfirm />

### 2. Require async authorization for your tool <!--a variation of this-->

<!--make it clear it's not a second factor-->

To require asynchronous authorization for your tool wrap the tool with the Async authorizer, `withAsyncUserConfirmation()`.


<!--to make CIBA a prereq before running. This guarantees that the CIBA process intercepts the tool call to do the following: this should be a sequence diagram-->

Wrap the tool with the Async authorizer in `src/lib/tools/buy.ts`. This will intercept the tool call to initiate a CIBA request:
- The CIBA request includes the user ID that will approve the request.
- Auth0 sends the user a mobile push notification. The AI agent polls the `/token` endpoint for a user response.
- The mobile application retrieves the `binding_message` containing the consent details, in this case, the quantity of stock to purchase for a stock ticker.
- The user responds to the request:
  - If the request is approved, the tool execution will continue.
  - If the request is rejected, the tool execution will not continue.

![CIBA sequence diagram](/img/async_auth_diagram.png)

In our example, we wrap a tool that buys shares for a given stock picker on the user’s behalf. When the user approves the transaction, the Auth0 AI SDK retrieves an access token to call the stock’s API. Upon completing the CIBA flow, the AI agent responds with a message confirming the purchase.

The Auth0 AI SDK returns an error response if the user denies the transaction.

```ts showLineNumbers title="./src/lib/tools/buy.ts"
import "dotenv/config";

import { tool } from "ai";
import { z } from "zod";

import { Auth0AI, getCIBACredentials } from "@auth0/ai-vercel";
import { AccessDeniedInterrupt } from "@auth0/ai/interrupts";
export type Context = {
  userId: string;
};

const auth0AI = new Auth0AI();

export const buy = (context: Context) => {
  // highlight-next-line
  const withAsyncAuthorization = auth0AI.withAsyncUserConfirmation({
    // highlight-next-line
    userID: context.userId,
    // highlight-next-line
    bindingMessage: async ({ ticker, qty }) =>
      // highlight-next-line
      `Do you want to buy ${qty} shares of ${ticker}`,
    scopes: ["openid", "stock:trade"],
    audience: process.env["AUDIENCE"]!,
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
    // highlight-next-line
    onAuthorizationRequest: "block",
    onUnauthorized: async (e: Error) => {
      if (e instanceof AccessDeniedInterrupt) {
        return "The user has deny the request";
      }
      return e.message;
    },
  });

  return withAsyncAuthorization(
    tool({
      description: "Use this function to buy stock",
      parameters: z.object({
        ticker: z.string(),
        qty: z.number(),
      }),
      execute: async ({ ticker, qty }) => {
        const headers = {
          "Content-Type": "application/json",
        };
        const body = {
          ticker: ticker,
          qty: qty,
        };
        // highlight-next-line
        const credentials = getCIBACredentials();
        const accessToken = credentials?.accessToken?.value;

        if (accessToken) {
          headers["Authorization"] = "Bearer " + accessToken;
        }

        console.log("Executing request to buy stock");

        const response = await fetch(process.env["STOCK_API_URL"]!, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        });

        return response.statusText;
      },
    })
  );
};
```

### 3. Integrate the tool into an AI agent

Create a file at `src/index.ts` and add tool calling to the Vercel AI agent using the `generateText()` or `streamText()` functions.

```ts showLineNumbers title="./src/index.ts"
import { setAIContext } from "@auth0/ai-vercel";
import crypto from "node:crypto";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

import { buy } from "./lib/tools/buy";

async function main() {
  const threadID = crypto.randomUUID();
  // highlight-next-line
  setAIContext({ threadID });

  console.log(
    "Check your mobile device for Auth0 Guardian notification and approve the request"
  );

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "Buy 3 stocks of Google",
    maxSteps: 2,
    tools: {
      // pass an Auth0 user id. For example, 'auth0|100000000000000000000' or 'google-oauth2|100000000000000000000'
      // highlight-next-line
      buy: buy({ userId: "<authenticated-user-id>" }),
    },
  });

  console.log(text);
}

main().catch(console.error);
```
<!--print call to show directory structure?-->

You should now have a CLI app that allows you to interact with the AI agent.

## Test the application

<!--Link to sample apps that use async auth-->
<!--make clear it's a CLI app-->

To test the CLI app, set a prompt, such as "Buy 3 stocks of Google," and pass it the user ID of the user approving or declining the transaction. You can get the user ID from the [Auth0 Dashboard](https://manage.auth0.com/). Navigate to **User Management** > **Users** and click on a user. The ID should look like `auth0|123456789`.

Now, run `npm start` and look for a push notification from the Auth0 Guardian app or your [custom app integrated with the Auth0 Guardian SDK](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow/user-authorization-with-ciba) on your mobile device. Once you approve the notification, you should see the tool being executed on your console.

Explore [the example app on GitHub](https://github.com/auth0-samples/auth0-ai-samples/tree/main/asynchronous-authorization/vercel-ai-node-js).

</Language>
  <Language id="python" name="FastAPI" icon="FastAPI.svg" disabled={true}>

  // TODO: Python doc goes here

  </Language>

</LanguageSelector>

## Next steps

You have successfully added an authorization step to protect tool calling in asynchronous AI agents. For next steps:
- Learn more about the <ArrowLink text="Client-Initiated Backchannel Authentication Flow" href="https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow"/>.
- Learn how to <ArrowLink text="Configure Rich Authorization Requests" href="https://auth0.com/docs/get-started/apis/configure-rich-authorization-requests"/>.
</QuickstartClientContextProvider>
