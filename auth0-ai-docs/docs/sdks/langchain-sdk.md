---
id: langchain-sdk
title: LangChain
description: Learn how to use Auth for GenAI LangChain SDKs.
slug: /sdks/langchain-sdk
sidebar_position: 22
hide_table_of_contents: true
---

# LangChain SDKs & Samples

Auth for GenAI LangChain & LangGraph SDK make it easy for developers to integrate with and secure any AI agent workflow using LangChain and LangGraph.

:::note

We value your feedback! To ask questions, report issues, or request new frameworks and providers, connect with us on [GitHub](https://github.com/auth0/auth-for-genai).

:::

## JavaScript & TypeScript SDKs

### [Auth0 AI for LangChain](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-langchain)

This SDK provides building blocks for using Auth for GenAI with [LangChain](https://www.langchain.com/) and [LangGraph](https://www.langchain.com/langgraph). It supports:

- A RAG Retriever for using OpenFGA
- Tools for implementing asynchronous user authentication
- Tools for getting access tokens for third-party connections
- [OpenFGA-based](https://openfga.dev/) tool authorizers

```bash
npm install @auth0/ai-langchain
```

## Python

### [Auth0 AI for LangChain](https://github.com/auth0-lab/auth0-ai-python/tree/main/packages/auth0-ai-langchain)

This SDK provides building blocks for using Auth for GenAI with LangChain and LangGraph. Includes a RAG Retriever for using OpenFGA, tools for implementing asynchronous user authentication, tools for getting access tokens for third-party connections, and OpenFGA-based tool authorizers. It supports:

- A RAG Retriever for using OpenFGA,
- Tools for getting access tokens for third-party connections,
- OpenFGA-based tool authorizers.

```bash
pip install auth0-ai-langchain
```

## Sample applications

Checkout our sample applications built with LangChain and LangGraph.

- [Assistant0](https://github.com/auth0-samples/auth0-assistant0) (Next.js): A fullstack AI personal assistant that consolidates digital life by dynamically accessing multiple tools to help stay organized and efficient.
- [AI Samples](https://github.com/auth0-samples/auth0-ai-samples): Explore our repository of sample applications showcasing Auth0's authentication and authorization capabilities in the context of generative AI applications.
- [Auth0 AI SDK TypeScript samples](https://github.com/auth0-lab/auth0-ai-js/tree/main/examples): Explore our repository of sample applications showcasing Auth0's authentication and authorization capabilities in the context of generative AI applications.
- [Auth0 AI SDK Python samples](https://github.com/auth0-lab/auth0-ai-python/tree/main/examples): Explore our repository of sample applications showcasing Auth0's authentication and authorization capabilities in the context of generative AI applications.

## Guides & Tutorials

Checkout our guides for LangChain and LangGraph in TypeScript and Python.

- [Build an AI Assistant with LangGraph, Vercel, and Next.js: Use Gmail as a Tool Securely](https://auth0.com/blog/genai-tool-calling-build-agent-that-calls-gmail-securely-with-langgraph-vercelai-nextjs/)
- [Check Google Calendar Availability](../check-google-calendar-availability)
- [List GitHub Repositories](../list-github-repositories)
- [List Slack Channels](../list-slack-channels)
