---
id: asynchronous-authorization
title: Asynchronous Authorization
description: Asynchronous Authorization for AI Agents
slug: /intro/asynchronous-authorization
hide_table_of_contents: true
---

# Asynchronous Authorization

Asynchronous Authorization provides a secure "human-in-the-loop" mechanism, allowing agents to work autonomously in the background and seek user consent for sensitive or critical actions only when necessary.

This process relies on a decoupled authentication flow where the user provides consent on a trusted device, such as their mobile phone, separate from the device where the agent was initially engaged.

## Use cases for asynchronous authorization

AI agents often need to perform actions that are long-running, are executed at a later time, or involve sensitive operations. For example:

- **Transactional approvals:** An agent arranging a business trip might find a flight and hotel, but needs the user's final approval to complete the purchase.
- **Accessing sensitive data:** An agent might need to access a protected user's health records to answer a query.
- **Executing high-privilege tasks:** A DevOps agent might need permission to deploy a new version of an application to a production environment.

In these scenarios, the agent needs the user to approve an action at a later time. Asynchronous authorization allows the agent to initiate this request and let the user approve it at their convenience, creating a more seamless and secure user experience.

This decoupled mechanism is also ideal for human-in-the-loop interactions, such as approving a stock purchase through a chatbot or completing a financial transaction with a banking agent.

## How it works: Client-Initiated Backchannel Authentication and Rich Authorization Requests

Auth0 implements asynchronous authorization using the **Client-Initiated Backchannel Authentication (CIBA)** standard, enhanced with **Rich Authorization Requests (RAR)**.

- [**CIBA**](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0.html) is an OpenID Foundation specification that defines a decoupled flow where a client application (the AI agent's backend, for example) can initiate an authentication request without direct interaction from the user on the same device. The user then approves or denies the request on a separate, trusted authentication device (like a mobile phone), typically via a push notification to an authenticator app or via SMS or email.
- [**RAR**](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-rar) is an OAuth 2.0 extension that allows client applications to request more complex permissions beyond standard OAuth 2.0 scopes in an authorization request. It allows the agent to send a detailed, structured payload describing the exact transaction. This provides the user with specific, verifiable context such as “Approve payment of $50.00 to ExampleCorp”, instead of a generic prompt, which is critical for establishing user trust and security. Using RAR is optional for a CIBA flow.

The flow generally proceeds as follows:

<!-- ![Asynchronous authorization flow diagram][image8] -->

1. **Initiation:** The agent's backend identifies a need for user approval and sends a CIBA request to the Auth0 `/bc-authorize` endpoint. This request includes a user identifier and the optional RAR payload in the (`authorization_details`) parameter.
2. **Acknowledgment:** Auth0 immediately acknowledges the request by returning a unique `auth_req_id`.
3. **Polling:** The agent's backend uses `auth_req_id` to begin polling the Auth0 `/token` endpoint to check for completion.
4. **User consent:** In parallel, Auth0 sends a notification (e.g., push, SMS, or email) to the user's authentication device, displaying the rich context from the RAR payload. The user approves or denies the request.
5. **Token issuance:** Once the user approves, the next polling request from the agent's backend to the `/token` endpoint will succeed. Auth0 returns the required access and ID tokens, allowing the agent to complete the authorized action.

## Get started

To begin using Asynchronous Authorization in your GenAI applications, refer to the following resources:

- **Quickstarts:**
  - [Asynchronous Authorization](../async-authorization)
- **Guides:**
  - [Configure Rich Authorization Requests (RAR)](https://auth0.com/docs/get-started/apis/configure-rich-authorization-requests)
- **Sample Apps:**
  - [Assistant0: Next.js + Vercel AI SDK](https://github.com/auth0-samples/auth0-assistant0/tree/vercel-ai)
  - Assistant0: Next.js + LangGraph - Coming soon
  - Assistant0: Next.js + LlamaIndex - Coming soon
  - [Auth0 AI SDK TypeScript samples](https://github.com/auth0-lab/auth0-ai-js/tree/main/examples/async-user-confirmation)
  - [Auth0 AI SDK Python samples](https://github.com/auth0-lab/auth0-ai-python/tree/main/examples/async-user-confirmation)

## Learn more

- [Client-Initiated Backchannel Authentication Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow)
- [User Authorization with CIBA](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow/user-authorization-with-ciba)
