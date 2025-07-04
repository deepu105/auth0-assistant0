---
slug: /
id: intro
sidebar_position: 1
hide_table_of_contents: true
---

import Card from "@site/src/components/Card";
import EarlyAccessBanner from "@site/src/components/EarlyAccessBanner";

# Auth for GenAI

<!-- ![Hero Image](https://cdn.auth0.com/website/auth0/ai/landing/finalhero.png) -->

Secure your AI Agents and GenAI applications with robust user authentication, secure API access, human-in-the-loop controls, and fine-grained authorization for your data.

<EarlyAccessBanner href="https://dev.auth0.com/signup?onboard_app=genai"/>

<p></p>

Auth for GenAI provides a robust identity and access management platform designed on top of industry standards to secure every layer of your GenAI stack. We offer solutions for common challenges, such as insecurely hardcoded API keys, lack of user consent in agent-led workflows, and weak authorization in RAG pipelines.
Auth for GenAI works out of the box with popular AI frameworks like LangChain, LlamaIndex, Genkit, and the Vercel AI SDK, enabling developers to build and deploy secure AI-powered applications that users can trust.

## Sample applications

Explore our sample applications and templates

<Card href="https://github.com/auth0-samples/auth0-assistant0" headerText="Assistant0" icon="icon-landing-user.png" iconBorder={false} tags={['next.js', 'vercel ai', 'LangChain']}>
Assistant0, a Next.js based AI personal assistant that consolidates digital life by dynamically accessing multiple tools to help stay organized and efficient.
</Card>
<Card href="https://github.com/auth0-samples/agent0" headerText="Agent0" icon="icon-landing-user.png" iconBorder={false} tags={['fastify']}>
Agent0, a full-stack AI personal assistant powered by React and Fastify, that invokes your APIs using tool calls on a logged-in user's behalf.
</Card>
<Card href="https://github.com/auth0-samples/auth0-ai-samples" headerText="AI Samples" icon="icon-multishape.png" iconBorder={false} tags={['LangChain', 'fastapi', 'vercel ai', 'LlamaIndex']}>
Explore our repository of sample applications showcasing Auth0's authentication and authorization capabilities in the context of generative AI applications.
</Card>

## Use cases

Explore the core concepts of Auth for GenAI. Each section provides an overview of a key use case, including architectural patterns and the benefits of using Auth0.

### User authentication

Securely authenticate users in your GenAI applications using Auth0's [Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login) with support for social, enterprise, and custom identity providers. This allows you to leverage robust standards like OAuth 2.0 and OpenID Connect to secure both interactive and headless AI agents.

[Learn more](./intro/user-authentication)

### Call your APIs on a user's behalf

Enable AI agents to securely call your application's own APIs (first-party APIs) on behalf of a user using OAuth 2.0. This pattern ensures that the user's context is maintained, preventing agents from having broad, unrestricted access to all user data.

[Learn more](./intro/call-your-apis-on-users-behalf)

### Call other's APIs on a user's behalf using Token Vault

Securely connect AI agents to external tools and services like Google, Slack, or GitHub. Our Token Vault feature manages the complexities of obtaining, storing, and refreshing API tokens, allowing your agents to interact with third-party APIs without handling sensitive credentials or API keys directly.

[Learn more](./intro/token-vault)

### Asynchronous authorization

Implement "human-in-the-loop" workflows for actions that are long-running or require user consent. Using standards like [CIBA (Client-Initiated Backchannel Authentication)](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow), agents can request approval for sensitive operations via push notifications, SMS, or email, even when the user is not actively using the application.

[Learn more](./intro/asynchronous-authorization)

### Authorization for RAG

Enforce fine-grained, document-level access control within your Retrieval Augmented Generation (RAG) pipelines using [Auth0 FGA](https://auth0.com/fine-grained-authorization). This ensures that when a Large Language Model (LLM) generates a response, it only uses data that the current user is authorized to see, preventing [sensitive data leakage](https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/) and ensuring compliance.

[Learn more](./intro/authorization-for-rag)

## Get started

Follow our [quickstart guides](./get-started) for a step-by-step tutorial on implementing authentication and authorization in your GenAI applications.

## Frameworks

Explore samples and SDKs for the different frameworks supported by Auth for GenAI.

- [LangChain and LangGraph](./frameworks/langchain)
- [LlamaIndex](./frameworks/llamaindex)
- [Vercel AI SDK](./frameworks/vercel-ai)
- [Genkit](./frameworks/genkit)
