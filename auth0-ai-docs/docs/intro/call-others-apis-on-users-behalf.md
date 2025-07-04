---
id: call-others-apis-on-users-behalf
title: Call Other's APIs on User's Behalf
description: Call Other's APIs on User's Behalf
slug: /intro/call-others-apis-on-users-behalf
hide_table_of_contents: true
---

# Call Other's APIs on the User's Behalf

[Token Vault](./token-vault) lets your AI agent call external APIs on the user's behalf. We provide SDKs for Python, JavaScript, and popular AI frameworks like LangChain, LlamaIndex, Genkit, and Vercel AI, making it easy and straightforward to get access tokens for your federated connections.

## Web applications with backend for frontend

In a typical scenario, a user interacts with a frontend application (e.g., a chatbot interface). This frontend communicates with a backend service, often a Backend for Frontend (BFF) or an agent, which is responsible for calling the external API.

<!-- Here is a high-level architecture diagram: -->

<!-- ![Token vault architecture diagram](image1.png) -->

By modeling your agent's backend as a secure application, it can obtain the necessary tokens from Token Vault to interact with external APIs while maintaining the user's context and permissions.

<!-- ## Headless agents/CLIs -->

## Get started

To begin using Auth0 Token Vault in your GenAI applications, refer to the following resources:

- **Quickstarts:**
  - [Call Other's APIs on User's Behalf](../call-others-apis-on-users-behalf)
- **Guides:**
  - [Check Google Calendar Availability](../check-google-calendar-availability)
  - [List GitHub Repositories](../list-github-repositories)
  - [List Slack Channels](../list-slack-channels)
  - [Get Salesforce Opportunities](../get-salesforce-opportunities)
- **Sample Apps:**
  - [Assistant0: Next.js + LangGraph](https://github.com/auth0-samples/auth0-assistant0)
  - [Assistant0: Next.js + Vercel AI SDK](https://github.com/auth0-samples/auth0-assistant0/tree/vercel-ai)
  - Assistant0: Next.js + LlamaIndex - Coming soon
  - [Auth0 AI SDK TypeScript samples](https://github.com/auth0-lab/auth0-ai-js/tree/main/examples/calling-apis)
  - [Auth0 AI SDK Python samples](https://github.com/auth0-lab/auth0-ai-python/tree/main/examples/calling-apis)

## Learn more

- [Auth0 Docs for Token Vault](https://auth0.com/docs/secure/tokens/token-vault)
- [Call APIs with Token Vault](https://auth0.com/docs/secure/tokens/token-vault/call-apis-with-token-vault)
- [Configure Token Vault](https://auth0.com/docs/secure/tokens/token-vault/configure-token-vault)
