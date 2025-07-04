---
id: account-linking
title: Account Linking
description: Account Linking for Token Vault
slug: /intro/account-linking
hide_table_of_contents: true
---

# Account Linking

Account linking in Auth0 allows a user to connect multiple identity provider accounts, such as Google, GitHub, or a corporate SAML connection, under a single, unified user profile. By default, Auth0 treats each login from a different provider as a separate user. Account linking merges these distinct identities, enabling a user to authenticate from any of their linked accounts and be recognized as the same person by your application.

## Why is account linking important for GenAI

For GenAI applications, and particularly for AI agents that need to act on a user's behalf, account linking is critical. An agent might need to access a user's calendar via their Google account and their code repositories through their GitHub account. Without account linking, the agent would see these as two separate users.

By linking these accounts, your GenAI application and its agents have a holistic view of the user. This unified profile is essential for Token Vault to retrieve the correct tokens for the various external services the agent needs to call. When an agent requests to access a third-party API, account linking ensures that Auth0 can associate that request with the current user and their authorized connections.

### How it works

The account linking process merges two user profiles into a primary and a secondary account. The user_id and core profile properties of the primary account are retained, and the secondary account's identity is added to the primary profile's identities array. Multiple secondary accounts can be added to a primary account by linking.

There are two primary methods for implementing account linking:

- [**User-initiated account linking (client-side)**](https://auth0.com/docs/manage-users/user-accounts/user-account-linking/user-initiated-account-linking-client-side-implementation)**:** In this scenario, the user explicitly chooses to link their accounts through a settings page or a similar interface within your application. This is a common pattern and is the recommended approach for many GenAI use cases.
- [**Suggested account linking (server-side)**](https://auth0.com/docs/manage-users/user-accounts/user-account-linking/suggested-account-linking-server-side-implementation)**:** This approach identifies users with the same verified email address across different connections and prompts them to link their accounts. This is typically handled in a regular web application where server-side code can query the Auth0 Management API to find potential accounts to link. This can also be done using the [Account Link Extension](https://auth0.com/docs/customize/extensions/account-link-extension).

### Client-initiated account linking for GenAI

For GenAI applications, **Client-initiated account linking** is a new option that provides a seamless way for users to grant AI agents access to different services. When an agent needs to access a new service (e.g., Google Calendar) for which it doesn't have a token, the application can trigger the account linking flow.

![Client-initiated account linking flow](/img/client_initiated_account_linking.png)

The key steps are:

1. **Trigger the flow:** The client application initiates the flow when an agent needs access to a new external provider.
2. **User authentication:** The user is prompted to log in with the new account they wish to link.
3. **Token exchange and linking:** Auth0 handles the authentication with the new provider and, upon successful login, links the new identity to the user's primary profile.
4. **Token retrieval:** With the accounts now linked, your application can use Token Vault to retrieve an access token for the newly connected service to use for API calls.

This process ensures that the user maintains control and explicitly grants permission for each new service the agent needs to access, enhancing security and trust.

For a detailed guide on implementing this flow, please refer to the [Client-Initiated Account Linking Guide](../client-initiated-account-linking).

## Get started

To begin using Auth0 Token Vault in your GenAI applications, refer to the following resources:

- **Quickstarts:**
  - [Call Other's APIs on User's Behalf](../call-others-apis-on-users-behalf)
- **Guides:**
  - [Client-Initiated Account Linking Guide](https://auth0.com/ai/docs/client-initiated-account-linking)

## Learn more

- [User Account Linking](https://auth0.com/docs/manage-users/user-accounts/user-account-linking)
- [User-Initiated Account Linking: Client-Side Implementation](https://auth0.com/docs/manage-users/user-accounts/user-account-linking/user-initiated-account-linking-client-side-implementation)
- [User Account Linking: Server-Side Implementation](https://auth0.com/docs/manage-users/user-accounts/user-account-linking/suggested-account-linking-server-side-implementation)
