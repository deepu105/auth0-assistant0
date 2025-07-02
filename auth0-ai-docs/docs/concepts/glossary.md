---
id: concepts
title: Concepts
description: Learn about GenAI and identity management concepts related to Auth for GenAI. 
slug: /concepts
sidebar_position: 3
hide_table_of_contents: true
---

# Concepts

import Card from "@site/src/components/Card";
import ArrowLink from "@site/src/components/ArrowLink";

Learn about GenAI and identity management concepts related to Auth for GenAI.

## What is authentication and authorization?

Authentication verifies a user’s identity. Authorization grants or denies the user’s access to certain resources. To learn more, read [Authentication vs Authorization](https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization).

Auth0 secures your AI agent authentication and authorization flows with the following services:
- Authentication: [Passwordless](https://auth0.com/docs/authenticate/passwordless/passwordless-with-universal-login), [Multi-factor Authentication (MFA)](https://auth0.com/docs/secure/multi-factor-authentication), and [Single-Sign On (SSO)](https://auth0.com/docs/authenticate/single-sign-on). 
- Authorization: [Role-Based Access Control (RBAC)](https://auth0.com/docs/manage-users/access-control/rbac) and [Fine-Grained Authorization (FGA)](https://docs.fga.dev/fga). 

## What is fine-grained authorization?

Fine-grained authorization provides more granular control over what resources your users have access to on a server. In contrast to coarse-grained authorization such as [Role-Based Access Control (RBAC)](https://auth0.com/docs/manage-users/access-control/rbac), which defines access solely through roles, fine-grained authorization allows you to define authorization policies based on a combination of the following:

- User attributes, such as username, role, location, and more
- Actions the user wants to perform, such read, write, and delete
- Resources the user wants to access

Auth for GenAI provides fine-grained authorization through [Auth0 FGA](https://docs.fga.dev/). To learn how to set up fine-grained authorization for AI agents, read [Authorization for RAG](authorization-for-rag). 

## What is GenAI?

GenAI uses generative models to produce new content such as text, images, videos, and more. Trained on large datasets, GenAI models are able to learn patterns, styles, and structures while utilizing a variety of architectures, each with strengths for specific tasks and the type of content being generated: 

| **Model type** | **Common AI model** | **Used for** | 
|------------|-----------------|----------|
| Transformers | GPT, Bert, LLaMa | Text generation, chatbots, translation | 
| GANs (Generative Adversarial Networks) | StyleGAN, BigGAN | Image and video generation | 
| Diffusion models | DALL-E, Stable Diffusion | High-quality image synthesis | 
| RNNs and LSTMs | Older NLP models | Sequence generation such as in music and simple text |

When integrated with [agentic frameworks](#what-are-agentic-frameworks), GenAI models can move beyond generating content and autonomously plan, retrieve information, and make tool calls to third-party APIs. 

## What are agentic frameworks?

Agentic frameworks are software tools for developing autonomous AI agents capable of making complex decisions and managing their own workflows. Built on top of LLMs, AI agents can help with task delegation, data retrieval, tool integration, and more. 

AI agents have the ability to:
- Plan: Break down complex tasks into actionable steps. 
- Retrieve information: Use RAG for information retrieval. 
- Dynamically reason: Dynamically evaluate actions based on constraints.
- Execute: Fetch access tokens, make tool calls, and more. To learn more, read [Call Other's APIs on the user's behalf](call-others-apis-on-users-behalf).
- Remember and adapt: Stores context across interactions for better responses in the future. 

With [Auth0 SDKs](sdks), you can easily integrate with popular agentic frameworks, including [Genkit](https://firebase.google.com/docs/genkit), [LangChain](https://www.langchain.com/), [Vercel AI](https://sdk.vercel.ai/docs/introduction), and [LlamaIndex](https://www.llamaindex.ai/).

## What is Retrieval-augmented generation (RAG)?

A subset of GenAI includes large language models (LLMs) that utilize retrieval-augmented generation (RAG) to incorporate relevant information from external sources to provide more contextually accurate answers to user queries. 

RAG has the following components:
1. Retrieval: The model fetches relevant external documents from databases, APIs, or the web based on the user query. 
2. Augmentation: After ranking the retrieved documents based on relevancy, the most relevant documents are used as retrieved context in the prompt. 
3. Generation: The model generates a response using both its pretrained knowledge and retrieved context.

With [Auth0 SDKs](sdks), you can easily implement RAG in LLMs:
- [Auth0 AI with LangChain](https://github.com/auth0-lab/auth0-ai-python/tree/main/packages/langchain-auth0-ai): Integrate with LangChain to connect LLMs with vector databases for RAG. 
- [Auth0 AI with LlamaIndex](https://github.com/auth0-lab/auth0-ai-python/tree/main/packages/llama-index-auth0-ai): Integrate with LlamaIndex to structure external data for better retrieval. 

## Next steps

- To start building with Auth for GenAI, read the <ArrowLink text="Get started" href="get-started" newTab={false}/> quickstarts.