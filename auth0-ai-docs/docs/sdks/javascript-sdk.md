---
id: javascript-sdk
title: JavaScript
description: Learn how to use Auth for GenAI JavaScript SDKs.
slug: /sdks/javascript-sdk
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

## AI SDKs

AI SDKs to streamline integrating your application with popular agentic frameworks:

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

### [Redis Store for Auth0 AI](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-redis)

This SDK provides a secure Redis-based data store implementation for use with the Auth0 AI SDKs. It supports:

- Securely encrypting data before storing it in Redis
- Organizing keys using namespaces
- Setting expiration times for stored data

```bash
npm install @auth0/ai-redis
```

## Sample applications

Checkout our sample applications for JavaScript/TypeScript built with frameworks like LangGraph and Vercel AI.

- Assistant0 (Next.js): A fullstack AI personal assistant that consolidates digital life by dynamically accessing multiple tools to help stay organized and efficient.
  - [LangGraph version](https://github.com/auth0-samples/auth0-assistant0)
  - [Vercel AI SDK version](https://github.com/auth0-samples/auth0-assistant0/tree/vercel-ai)
  - LlamaIndex version - Coming soon
- [SmartHR Assistant](https://github.com/auth0-samples/auth0-ai-smart-hr-assistant) (Next.js + LlamaIndex): A HR assistant that provides secure access to HR documents based on complex authorization rules.
- [Agent0](https://github.com/auth0-samples/agent0) (React + Fastify + Vercel AI SDK): A full-stack AI personal assistant powered by React and Fastify, that invokes your APIs using tool calls on a logged-in user's behalf.
- [AI Samples](https://github.com/auth0-samples/auth0-ai-samples): Explore our repository of sample applications showcasing Auth0's authentication and authorization capabilities in the context of generative AI applications.
- [Auth0 AI SDK samples](https://github.com/auth0-lab/auth0-ai-js/tree/main/examples): Explore our repository of sample applications showcasing Auth0's authentication and authorization capabilities in the context of generative AI applications.

## Guides & Tutorials

Checkout our guides for Next.js, LangChain, LlamaIndex, Vercel AI, and Genkit in JavaScript/TypeScript.

- [Check Google Calendar Availability](../check-google-calendar-availability)
- [List GitHub Repositories](../list-github-repositories)
- [List Slack Channels](../list-slack-channels)
- [Get Salesforce Opportunities](../get-salesforce-opportunities)
