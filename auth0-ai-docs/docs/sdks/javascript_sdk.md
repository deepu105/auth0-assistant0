---
id: javascript-sdk
title: JavaScript
description: Learn how to use Auth for GenAI SDKs to get a user's daily schedule.
slug: /javascript-sdk
sidebar_position: 22
hide_table_of_contents: true
---

# JavaScript SDKs

Auth0 JavaScript SDK libraries make it easy for developers to integrate with and secure any AI agent workflow.

:::note

We value your feedback! To ask questions, report issues, or request new frameworks and providers, connect with us on [GitHub](https://github.com/auth0/auth-for-genai).

:::

## Auth0 SDKs

Updated Auth0 SDKs to secure AI agent workflows:

### [Next.js](https://github.com/auth0/nextjs-auth0)

This SDK streamlines integrating Auth0 authentication and authorization services into Next.js applications. It supports:
- User authentication
- Tools for getting access tokens for supported social and enterprise identity providers

```bash
npm install @auth0/nextjs-auth0
```

### [Node.js](https://github.com/auth0/node-auth0)

This library streamlines integrating Auth0's authentication and authorization services into Node.js applications. It supports:
- User authentication
- Tools for signing up users, managing user profiles, and securing API endpoints.

```bash
npm install auth0
```

### [Auth0 Fastify SDK](https://www.npmjs.com/package/@auth0/auth0-fastify)
This SDK streamlines integrating Auth0 authentication and authorization services into Fastify applications. It supports:
- User authentication
- Tools for getting access tokens to call first-party APIs

```bash
npm i @auth0/auth0-fastify
```

## AI Framework SDKs

AI Framework SDKs to streamline integrating your application with popular agentic frameworks:

### [Auth0 AI SDK](https://github.com/auth0-lab/auth0-ai-js)

This SDK provides base abstractions for authentication and authorization in AI applications. It supports:
- Asynchronous user authentication using the [Client Initiated Backchannel Authentication (CIBA)](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0.html) protocol
- [OpenFGA-based](https://openfga.dev/) filter for RAG

```bash
npm install @auth0/ai
```

### [Auth0 AI Components](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-components)

This library helps to set up the React components that can be used in AI applications using Auth for GenAI. The components are styled using [Tailwind CSS](https://tailwindcss.com/). It supports:
- Tools for getting access tokens for supported social and enterprise identity providers

```bash
npx @auth0/ai-components add FederatedConnections
```

### [Auth0 AI for LangChain](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-langchain)

This SDK provides building blocks for using Auth for GenAI with [LangChain](https://www.langchain.com/) and [LangGraph](https://www.langchain.com/langgraph). It supports:
- A RAG Retriever for using OpenFGA
- Tools for implementing asynchronous user authentication
- Tools for getting access tokens for third-party connections
- [OpenFGA-based](https://openfga.dev/) tool authorizers

```bash
npm install @auth0/ai-langchain
```

### [Auth0 AI for Vercel AI SDK](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-vercel)

This SDK provides building blocks for using Auth for GenAI with the Vercel AI SDK. It includes tools for implementing asynchronous user authentication, tools for getting access tokens for third-party connections, building blocks to handle interrupts, and [OpenFGA-based](https://openfga.dev/) tool authorizers. It supports:
- Tools for implementing asynchronous user authentication
- Tools for getting access tokens for third-party connections
- [OpenFGA-based](https://openfga.dev/) tool authorizers

```bash
npm install @auth0/ai-vercel
```

### [Auth0 AI for Cloudflare Agents](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-cloudflare)

This SDK provides building blocks for using Auth for GenAI with the Cloudflare Agents API. It includes tools for implementing asynchronous user authentication, tools for getting access tokens for third-party connections, building blocks to handle interrupts, and [OpenFGA-based](https://openfga.dev/) tool authorizers. It supports:
- Tools for implementing asynchronous user authentication
- Tools for getting access tokens for third-party connections
- [OpenFGA-based](https://openfga.dev/) tool authorizers

```bash
npm install @auth0/ai-cloudflare
```

### [Auth0 AI for LlamaIndex](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-llamaindex)

This SDK provides building blocks for using Auth for GenAI with [LlamaIndex](https://www.llamaindex.ai/). Includes a RAG Retriever for using OpenFGA,  tools for implementing asynchronous user authentication, tools for getting access tokens for third-party connections, and [OpenFGA-based](https://openfga.dev/) tool authorizers. It supports:
- A RAG Retriever for using OpenFGA
- Tools for implementing asynchronous user authentication
- Tools for getting access tokens for third-party connections
- OpenFGA-based tool authorizers

```bash
npm install @auth0/ai-llamaindex
```

### [Auth0 AI for Genkit](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-genkit)

This SDK provides building blocks for using Auth for GenAI with [Genkit](https://firebase.google.com/docs/genkit). Includes a RAG Retriever for using OpenFGA, tools for implementing asynchronous user authentication, tools for getting access tokens for third-party connections, and [OpenFGA-based](https://openfga.dev/) tool authorizers. It supports:
- A RAG Retriever for using OpenFGA
- [OpenFGA-based](https://openfga.dev/) tool authorizer and re-ranker

```bash
npm install @auth0/ai-genkit
```

### [Redis Store for Auth0 AI](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-redis)

This SDK provides a secure Redis-based data store implementation for use with the Auth0 AI SDKs. It supports:
- Securely encrypting data before storing it in Redis
- Organizing keys using namespaces
- Setting expiration times for stored data

```bash
npm install @auth0/ai-redis
```
