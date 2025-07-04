---
id: user-authentication
title: User Authentication
description: User Authentication for AI Applications and AI Agents
slug: /intro/user-authentication
hide_table_of_contents: true
---

# User Authentication for AI Applications and AI Agents

Robust user authentication is essential for Generative AI applications and AI agents. It ensures security, protects data, and controls access to AI models and features.

## Why authentication matters for AI

- **Secure and controlled access:** Safeguards user data, manages who can use your AI and what they can do, and establishes a clear audit trail for both user and AI agent activities.
- **Agent identity & delegation:** Establishes an AI agent's identity and its authorization to act on behalf of a user.
- **Auditability:** Provides a record of user activities for auditing and compliance.
- **Personalization:** Enables tailored AI experiences by maintaining user preferences and conversational history.

## Authentication for users of AI applications

Auth0 is a flexible, drop-in solution to add authentication and authorization services to your applications. With Auth0, your users can log in with:

- Username and password
- [Passwordless and Passkeys](https://auth0.com/docs/authenticate/passwordless)
- [Social Login (Google, Meta, Microsoft, GitHub, etc.)](https://auth0.com/docs/authenticate/passwordless#social-login)
- [Corporate credentials and Single Sign On (SSO)](https://auth0.com/docs/authenticate/single-sign-on) for B2B AI applications
- And more.

Auth0 also provides the following features for enhanced security and scalability:

- [Multi-factor Authentication](https://auth0.com/docs/secure/multi-factor-authentication)
- [Attack Protection](https://auth0.com/docs/secure/attack-protection): Detect attacks and stop malicious attempts to access your application, such as blocking traffic from certain IPs and displaying CAPTCHA. This includes Bot Detection, Suspicious IP Throttling, Brute Force Protection, and Breached Password Detection.
- [Highly Regulated Identity](https://auth0.com/docs/secure/highly-regulated-identity)\`
- UI and login flow customizations via [Actions](https://auth0.com/docs/customize/actions) and [Forms](https://auth0.com/docs/customize/forms)

<!-- *![User authentication concept][image1]* -->

## User login flows for AI applications

Choosing a login flow impacts security and user experience. Auth0 offers two ways to implement login authentication for your applications.

1. [**Universal Login (Recommended)**](https://auth0.com/docs/authenticate/login/auth0-universal-login)**:** Users are redirected to a secure, hosted login page provided by Auth0.
   - **Enhanced security:** Your AI application never handles user credentials directly.
   - **Reduced development:** Simplifies implementation of secure login, password policies, and MFA.
   - **Centralized identity:** Manages user profiles and integrates various identity providers efficiently.
   - **Advanced customizations**: Allows you to build custom, client-rendered versions of Universal Login screens, giving you control over every pixel of your Universal Login experience.
   - **Use case:** Ideal for most GenAI services requiring secure, frictionless user access.

![Universal login screen](/img/universal_login.png)

2. [**Embedded Login**](https://auth0.com/docs/authenticate/login/embedded-login)**:** The login interface is integrated directly within your AI application's UI.
   - **Additional UI control:** Allows for highly customized branding.
   - **Increased responsibility:** Requires your team to manage sensitive data inputs and secure communication within your app.
   - **Complexity:** More challenging to implement and maintain advanced features.
   - **Use Case:** Suitable for highly specialized internal AI tools in tightly controlled environments.

## Authentication for AI agents and API access

With Auth0, it is possible to extend authentication to AI agents accessing services on their own:

- **Machine-to-Machine authentication:** For AI agents or backend services, use secure **OAuth 2.0 Client Credentials Flow** with **Client Secret**, **mutual TLS (mTLS)**, or **Private Key JWT** to authenticate directly with AI service APIs.
- **Delegated authorization:** When an AI agent acts on behalf of a human, the **[Client-Initiated Backchannel Authentication (CIBA)](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow/user-authentication-with-ciba)** and **[Device Authorization](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow)** flow allow the user to grant specific permissions to the agent without sharing their credentials.

## Call your APIs on a user's behalf

You can use Auth0 to authorize calls to your own APIs on behalf of logged-in users. The Auth0 SDKs make this easy. [Learn more](./call-your-apis-on-users-behalf).

## Get started

To begin using Auth0 authentication in your GenAI applications, refer to the following resources:

- **Quickstarts:**
  - [User Authentication](../user-authentication) for Next.js
  - [User Authentication](../user-authentication) for FastAPI
  - [Other official quickstarts](https://auth0.com/docs/quickstarts)
- **Sample Apps:**
  - [Next.js](https://github.com/auth0-samples/auth0-ai-samples/tree/main/authenticate-users/next-js)
  - [Agent0](https://github.com/auth0-samples/agent0) (React + Fastify + Vercel AI SDK)

## Learn more

- [Auth0 Docs](https://auth0.com/docs/articles)
- [Authentication API](https://auth0.com/docs/api/authentication)
- [SDKs](https://auth0.com/docs/libraries)
