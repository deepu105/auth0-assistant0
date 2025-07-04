---
id: call-your-apis-on-users-behalf
title: Call Your APIs on User's Behalf
description: Call Your APIs on User's Behalf
slug: /intro/call-your-apis-on-users-behalf
hide_table_of_contents: true
---

# Call Your APIs on the User's Behalf

Once Auth0 is set up for User Authentication, you can enable your AI applications and AI agents to securely call your own APIs (first-party APIs) on behalf of authenticated users. This capability allows AI agents to access user-specific data or perform actions with explicit user consent and scope.

## Delegated authorization

The process relies on **delegated authorization**, where the user grants your AI application or AI agent permission to access protected resources without sharing their credentials directly. This is achieved through **access tokens:**. After a user authenticates, Auth0 issues an access token to your AI application. This token represents the user's consent and defines the scope of permissions granted.

<!-- *![OAuth2 concept][image3]* -->

### API on Auth0

An API is an entity that represents an external resource, capable of accepting and responding to protected resource requests made by applications. These APIs are configured to accept and validate access tokens. To protect an API, it must be [registered as an API](https://auth0.com/docs/get-started/auth0-overview/set-up-apis) using the Auth0 Dashboard.

### How it works for AI apps and agents

<!-- *![OAuth2 flow diagram][image4]* -->

1. **User authentication:** A user logs into your AI application or agent interface (e.g., via Universal Login).
2. **Access token issuance:** Upon successful authentication, an access token is issued to your application.
3. **AI agent makes a tool call:** When the AI agent needs to access user-specific data or perform an action, it makes a tool call to an API endpoint.
4. **Token forwarding:** The access token obtained in step 2 is included in the API request (typically in the `Authorization` header).
5. **API validation & response:** The API validates the access token. If valid, it processes the request on behalf of the user and returns the response to the AI agent.
6. **AI agent receives and processes the information:** The AI agent then uses this response to fulfill the user's request.

## Get started

To begin using Auth0 for calling your APIs in your GenAI applications, refer to the following resources:

- **Quickstarts:**
  - [Call Your APIs On User's Behalf](../call-your-apis-on-users-behalf)
- **Sample Apps:**
  - [Next.js](https://github.com/auth0-samples/auth0-ai-samples/tree/main/call-apis-on-users-behalf/your-api-next-js)
  - [Agent0](https://github.com/auth0-samples/agent0) (React + Fastify + Vercel AI SDK)

## Learn more

- [Auth0 Docs for APIs](https://auth0.com/docs/get-started/apis)
