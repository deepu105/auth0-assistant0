---
id: connections
title: App Connections
description: App Connections for Token Vault
slug: /intro/connections
hide_table_of_contents: true
---

# App Connections

An App Connection in Auth0 is a relationship between Auth0 and a source of users, such as third-party applications (like Slack or Salesforce) or external Identity Providers (like Google or Microsoft). These App Connections allow users to log in to your application using those identities (such as log in with Google), and share their data from that application to your application. Auth0 standardizes the authentication process from various sources to simplify the integration of different identity providers.

For GenAI applications that utilize Token Vault, App Connections are essential. They allow your AI agents to securely access external APIs, such as Google Calendar or Microsoft 365, on behalf of the user. This is achieved by the user granting your application consent to access their data through these connections.

<!-- _![Token Vault concept][image6]_ -->

Within the Auth0 dashboard, App connections are grouped into two categories: Social Connections allow users to log in to your application using their credentials from popular social media and consumer platforms. This provides a frictionless login experience and can enrich user profiles with additional information.

Enterprise Connections are used to authenticate users against a federated corporate directory or identity provider. This is crucial for B2B applications where users need to log in with their company credentials or use single sign-on (SSO).

## Supported connections

Auth0 provides a large number of connection types, many of which already support Token Vault, and more will be supported soon. The ones that currently support Token Vault are as follows:

- **Google:** Allows users to log in with their personal Google account.
- **Microsoft:** Allows users to log in with their Microsoft account.
- **GitHub:** Allows users to log in with their GitHub account, which is useful for developer-focused applications.
- **Slack:** Allows users to log in with their Slack account, which is useful for developer-focused applications.
- **Box:** Allows users to log in with their Box account.
- **OpenID Connect (OIDC):** A simple identity layer on top of the OAuth 2.0 protocol. It allows clients to verify the identity of the end-user based on the authentication performed by an Authorization Server. Any Identity Provider that supports OIDC can be configured using this connection type, for example, Salesforce.
- **Custom Connections:** If a specific identity provider is not available out of the box, Auth0 allows you to create Custom Social Connections. This is particularly useful for integrating with any OAuth2-compliant authorization server. This extensibility ensures that your application can connect to a wide range of services as needed.

## Configuring connections for Token Vault

To enable your GenAI application to call APIs on a user’s behalf, you will need to:

1. **Obtain client credentials:** To enable your application to call APIs on a user’s behalf, you will need to obtain the **Client ID** and **Client Secret** from the connection you want to use.
2. **Create and configure the connection:** In the Auth0 Dashboard, navigate to **Authentication** and select the desired **Social** or **Enterprise** connection type, and configure using the obtained **Client ID** and **Client Secret**.
3. **Request the necessary scopes:** When configuring the connection, you need to specify the default scopes (permissions) your application requires to access the user's data from the third-party API.
4. **Enable Token Vault on the connection**: Scroll down to the end of the page to the **Advanced** section and toggle **Enable Token Vault** and save the connection.
5. **Enable the connection for your application:** Ensure that the newly configured connection is enabled for the Auth0 application that represents your GenAI app under **Applications** \> **Applications** \> **\[your Auth0 app\]** \> **Connections.**

## Get started

To begin using Auth0 Token Vault in your GenAI applications, refer to the following resources:

- **Quickstarts:**
  - [Call Other's APIs on User's Behalf](../call-others-apis-on-users-behalf)
- **Guides:**
  - [Configure Google Social Connection](../google-sign-in-and-auth)

## Learn more

- [Social Identity Providers](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers)
- [Enterprise Identity Providers](https://auth0.com/docs/authenticate/identity-providers/enterprise-identity-providers)
- [Configure Token Vault](https://auth0.com/docs/secure/tokens/token-vault/configure-token-vault)
- [Auth0 Marketplace for Social Connections](https://marketplace.auth0.com/features/social-connections).
