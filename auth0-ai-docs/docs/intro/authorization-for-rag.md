---
id: authorization-for-rag
title: Authorization for RAG
description: Authorization for RAG
slug: /intro/authorization-for-rag
hide_table_of_contents: true
---

# Authorization for RAG

Authorization for Retrieval-Augmented Generation (RAG) ensures that when a GenAI application retrieves and uses your company's internal data to answer user questions, it only accesses information that the specific user is permitted to see. This prevents the AI model from inadvertently [exposing sensitive or confidential data](https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/) to unauthorized individuals.

## The challenge: Securing data in RAG pipelines

Retrieval-Augmented Generation (RAG) is a powerful technique that enhances Large Language Models (LLMs) by providing them with relevant, up-to-date information from external data sources, such as a company's internal knowledge base or document repository.

However, without proper access controls, a RAG pipeline could retrieve documents containing sensitive information (e.g., financial reports, HR documents, strategic plans) and use them to generate a response for a user who should not have access to that data. This could lead to serious data breaches and compliance violations. Simply filtering based on user roles is often insufficient for managing the complex, relationship-based permissions found in real-world applications.

## The solution: Auth0 Fine-Grained Authorization (FGA)

To solve this challenge, Auth for GenAI uses [**Auth0 Fine-Grained Authorization (FGA)**](https://auth0.com/fine-grained-authorization). Auth0 FGA is a flexible, high-performance authorization service for applications that require a sophisticated permissions system. It implements Relationship-Based Access Control (ReBAC) to manage permissions at large-scale. Auth0 FGA is built on top of [OpenFGA](https://openfga.dev/), created by Auth0, which is a [CNCF](https://cncf.io/) sandbox project.

Auth0 FGA allows you to decouple your authorization logic from your application code. Instead of embedding complex permission rules directly into your application, you define an authorization model and store relationship data in Auth0 FGA. Your application can then query Auth0 FGA at runtime to make real-time access decisions.

### How it works with RAG

Integrating Auth0 FGA into your RAG pipeline ensures that every document is checked against the user's permissions before it's passed to the LLM.

<!-- ![RAG authorization flow diagram][image9] -->

The process works as follows:

1. **Authorization model:** First, you define your authorization model in Auth0 FGA. This model specifies the types of objects (e.g., `document`), the possible relationships between users and objects (e.g., `owner`, `editor`, `viewer`), and the rules that govern access.
2. **Store relationships:** You store permissions as 'tuples' in Auth0 FGA. A tuple is the core data element, representing a specific relationship in the format of `(user, relation, object)`. For example, `user:anne` is a `viewer` of `document:2024-financials`.
3. **Fetch and filter:** When a user submits a query to your GenAI application, your backend first fetches relevant documents from a vector database and then makes a permission check call to Auth0 FGA. This call asks, "Is this user allowed to view these documents?". Our AI framework SDKs abstract this and make it as easy as plugging in a filter in your retriever tool.
4. **Secure retrieval:** Auth0 FGA determines if the user is authorized to access the documents. Your application backend uses this data to filter the results from the vector database and only sends the authorized documents to the LLM.
5. **Secure response:** The LLM generates a response based _only_ on the information the user is permitted to see, preventing any data leakage.

## Get started

To begin using Auth0 FGA in your GenAI applications, refer to the following resources:

- **Quickstarts:**
  - [Authorization for RAG](../authorization-for-rag)
  - [Auth0 FGA Getting Started](https://docs.fga.dev/getting-started)
- **Sample Apps:**
  - [Assistant0: Next.js + Vercel AI SDK](https://github.com/auth0-samples/auth0-assistant0/tree/vercel-ai)
  - Assistant0: Next.js + LangGraph - Coming soon
  - Assistant0: Next.js + LlamaIndex - Coming soon
  - [SmartHR Assistant: Next.js + LangChain](https://github.com/auth0-samples/auth0-ai-smart-hr-assistant)
  - [AI Samples: Multiple frameworks](https://github.com/auth0-samples/auth0-ai-samples/tree/main/authorization-for-rag)
  - [Auth0 AI SDK TypeScript samples](https://github.com/auth0-lab/auth0-ai-js/tree/main/examples/authorization-for-rag)
  - [Auth0 AI SDK Python samples](https://github.com/auth0-lab/auth0-ai-python/tree/main/examples/authorization-for-rag)

## Learn more

- [Auth0 FGA Documentation](https://docs.fga.dev/)
- [OpenFGA Documentation](https://openfga.dev/)
