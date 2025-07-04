---
id: python-sdk
title: Python
description: Learn how to use Auth for GenAI Python SDKs.
slug: /sdks/python-sdk
sidebar_position: 20
hide_table_of_contents: true
---

# Python SDKs

Auth0 Python SDK libraries make it easy for developers to integrate with and secure any AI agent workflow.

:::note

We value your feedback! To ask questions, report issues, or request new frameworks and providers, connect with us on [GitHub](https://github.com/auth0/auth-for-genai).

:::

## Auth0 SDKs

Updated Auth0 SDKs to secure AI agent workflows:

### [Auth0 Python Server SDK](https://github.com/auth0/auth0-server-python/tree/main/packages/auth0_server_python)

The Auth0 Server Python SDK is a library for implementing user authentication in Python applications.

```bash
pip install auth0-server-python
```

### [Auth0 Python API SDK](https://github.com/auth0/auth0-server-python/tree/main/packages/auth0_api_python)

The auth0-api-python library allows you to secure APIs running on Python, particularly for verifying Auth0-issued access tokens.

It’s intended as a foundation for building more framework-specific integrations (e.g., with FastAPI, Django, etc.), but you can also use it directly in any Python server-side environment.

```bash
pip install auth0-api-python
```

### [Auth0 FastAPI SDK](https://github.com/auth0/auth0-server-python/tree/main/packages/auth0_fastapi)

The Auth0 FastAPI SDK is a library for implementing user authentication in FastAPI web applications using Auth0.

```bash
pip install auth0-fastapi
```

### [Auth0 FastAPI API SDK](https://github.com/auth0/auth0-server-python/tree/main/packages/auth0_fastapi_api)

The Auth0 FastAPI API SDK library allows you to secure FastAPI APIs using bearer tokens from Auth0.

It exposes a simple `require_auth` dependency that checks if incoming requests have a valid JWT, then provides the token claims to your route handler.

```bash
pip install auth0-fastapi-api
```

## AI SDKs

AI SDKs to streamline integrating your application with popular agentic frameworks:

### [Auth0 AI SDK](https://github.com/auth0-lab/auth0-ai-python)

This SDK provides base abstractions for authentication and authorization in AI applications, including tools for implementing asynchronous user authentication using the Client Initiated Backchannel Authentication (CIBA) protocol. It supports:

- A RAG Retriever for using OpenFGA
- Tools for implementing asynchronous user authentication,
- Tools for getting access tokens for third-party connections,
- OpenFGA-based tool authorizers.

```bash
pip install auth0-ai
```

## Sample applications

Checkout our sample applications for Python built with frameworks like LangGraph and LLamaIndex.

- [Auth0 AI SDK samples](https://github.com/auth0-lab/auth0-ai-python/tree/main/examples): Explore our repository of sample applications showcasing Auth0's authentication and authorization capabilities in the context of generative AI applications.
- [AI Samples](https://github.com/auth0-samples/auth0-ai-samples): Explore our repository of sample applications showcasing Auth0's authentication and authorization capabilities in the context of generative AI applications.

## Guides & Tutorials

Checkout our guides for LangChain and LlamaIndex in Python.

- [Check Google Calendar Availability](../check-google-calendar-availability)
- [List GitHub Repositories](../list-github-repositories)
- [List Slack Channels](../list-slack-channels)
