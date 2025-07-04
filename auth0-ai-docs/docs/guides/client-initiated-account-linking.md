---
id: client-initiated-account-linking
title: Client-Initiated Account Linking
description: Learn how Auth for GenAI enables AI agents to link user accounts.  
slug: /client-initiated-account-linking
sidebar_position: 13
hide_table_of_contents: true
---

import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import AccountLinkingPreReq from "@site/src/components/Quickstarts/AccountLinkingPreReq";
import LinkAccountParameters from './account-linking/_link-account-parameters.md';

# Client-Initiated Account Linking

import ArrowLink from "@site/src/components/ArrowLink";

Client-initiated account linking enables AI agents to request access and connect to multiple identity providers on the user’s behalf through Auth0.

When a user authenticates with a supported identity provider, Auth0 creates a new identity associated with the connection in the user profile’s `identities` array. A user can have multiple identities associated with various identity providers.

Account linking is the process of linking multiple identities in a single user profile. As a result, users can log into supported identity providers with a single set of credentials instead of creating a separate user account for each identity provider. To learn more, read [User account linking](https://auth0.com/docs/manage-users/user-accounts/user-account-linking).

In Client-initiated account linking, the client initiates the account linking request to Auth0 on the user’s behalf. When the client attempts to access an external provider’s API that the user has not granted access to, Auth0 returns a response that it cannot find the access token for that service, triggering the account linking flow.

<LanguageSelector>
  <Language id="js" name="JavaScript" icon="js.svg">
  <AccountLinkingPreReq />

## How it works

Let’s walk through a real-world example: After authenticating via Auth0 using [Passkeys](https://auth0.com/docs/authenticate/database-connections/passkeys), a user asks an AI agent integrated with a productivity app to fetch Google Calendar events:

1. The application calls the Agent API with an Auth0 access token and the user input “Get Google Calendar events for today and tomorrow.”
2. The Agent API uses an Auth0 access token to call Auth0 and requests a Google access token with the Calendar scopes. 
3. Auth0 looks for a Google access token with the requested Calendar scopes in the secure [Token Vault](https://auth0.com/docs/secure/tokens/token-vault). Because the user has not authorized access to the Google Calendar API, Auth0 returns a `tokenset_not_found` response.
4. The Agent API returns this response to the application, which initiates an account linking request to Auth0.
5. When the user authorizes access to the Google Calendar API, they also authorize Auth0 to perform the account linking flow.
6. Auth0 then uses the Google access token to call the Google Calendar API and complete the operation.

![Client-initiated account linking flow](/img/client_initiated_account_linking.png)

When the primary user logs in via `/authorize`, the Client-Initiated Account Linking [`post-login`](https://auth0.com/docs/customize/actions/explore-triggers/signup-and-login-triggers/login-trigger#login-post-login) Action checks for the `link_account` scope and attempts to link the requested user account (secondary account) with their existing logged in account (primary account). In our example, the user's Auth0 account is the primary account and the user's Google account is the secondary account.

## Link user accounts

To link user accounts, generate an authorize URL and pass the `link_account` scope along with the following parameters:

<LinkAccountParameters />

```tsx
// src/app/page.tsx
import { auth0 } from "@/lib/auth0";

async function generateAccountLinkingHref(requested_connection: string) {
  "use server";
  const session = await auth0.getSession();
  const id_token_hint = session!.tokenSet!.idToken!;
  const authParams = new URLSearchParams({
    scope: "link_account openid profile offline_access",
    requested_connection,
    id_token_hint,
  }).toString();

  return `/auth/login?${authParams}`;
}

export default async function Home() {
  return (
    <a href={await generateAccountLinkingHref("google-oauth2")}>
      Link Google Account
    </a>
  );
}
```

When the account linking flow has been triggered: 

1. The Action checks if the user has a linked account for the requested connection by searching the user profile’s `identities` array. If a linked account for the requested connection already exists, the Action exits the account linking flow.
2. The Action validates the ID token passed to `id_token_hint` by verifying that its `sub` claim matches the session's user ID. Note that the ID token shouldn’t be older than the expiration defined in the `exp` claim.
3. After the Action determines that the currently logged-in user is the same user Auth0 is requesting account linking for, Auth0 validates that the user has access to the requested connection. 
4. The user authenticates with the requested connection by logging into their secondary account. If the secondary account requires MFA, the user authenticates with the configured MFA factor. 
5. Auth0 redirects back to the Action with the ID token from the secondary account authentication.
6. After the Action validates the ID token, it uses Auth0 SDKs to link accounts into a single user profile. The secondary account is added to the user profile’s `identities` array.
7. The Action sets the user ID back to that of the primary account. The user account linking flow completes and redirects the user back to your application.

## Unlink accounts

To unlink accounts, use the Management API to call the [Unlink a user account](https://auth0.com/docs/api/management/v2#!/Users/delete_user_identity_by_user_id) endpoint. To learn more, read [Unlink user accounts](https://auth0.com/docs/manage-users/user-accounts/user-account-linking/unlink-user-accounts).

</Language>

<Language id="python" name="Python" icon="python.svg" disabled>
<!--
## How it works

Let’s walk through a real-world example: A user asks an AI agent integrated with a productivity app to fetch Google Calendar events:

1. The application calls the Agent API with an Auth0 access token and the user input “Get Google Calendar events for today and tomorrow.”
2. The Agent API uses an Auth0 access token to call Auth0 and requests a Google access token with the calendar scopes. 
3. Auth0 looks for a Google access token with the calendar scopes in the secure Token Vault. Because the user has not authorized a Google social connection with the Calendar scopes, Auth0 returns a `tokenset_not_found` response.
4. The Agent API returns this response to the application, which initiates an account linking request to Auth0.
5. Once the user has authorized access to the Google Calenar API, Auth0 performs the account linking flow. Auth0 then uses the Google access token to call the Google Calendar API and complete the operation.

When the primary user logs in via `/authorize`, the Client-Initiated Account Linking [`post-login`](https://auth0.com/docs/customize/actions/explore-triggers/signup-and-login-triggers/login-trigger#login-post-login) Action checks for the `link_account` scope and attempts to link the requested user account (secondary account) with their existing logged in account (primary account).

### Link user accounts

To link user accounts, generate an authorize URL and pass the `link_account` scope along with the following parameters:

```python
auth_url = self.url_builder.get_authorize_url(
    state=state,
    scope="link_account openid profile offline_access",
    requested_connection=connection,
    id_token_hint=id_token,
    client_id=self.client_id,
    redirect_uri=self.redirect_uri,
)
```

When the account linking flow has been triggered: 

1. The Action checks if the user has a linked account for the requested connection by searching the user profile’s `identities` array. If a linked account for the requested connection already exists, the Action exits the account linking flow.
2. The Action validates the ID token passed to `id_token_hint` by verifying that its `sub` claim matches the session's user ID. Note that the ID token shouldn’t be older than the expiration defined in the `exp` claim.
3. After the Action determines that the currently logged-in user is the same user Auth0 is requesting account linking for, Auth0 validates that the user has access to the requested connection. 
4. The user authenticates with the requested connection by logging into their secondary account. If the secondary account requires MFA, the user authenticates with the configured MFA factor. 
5. Auth0 redirects back to the Action with the ID token from the secondary account authentication.
6. After the Action validates the ID token, it uses Auth0 SDKs to link accounts into a single user profile. The secondary account is added to the user profile’s `identities` array.
7. The Action sets the user ID back to that of the primary account. The user account linking flow completes and redirects the user back to your application.-->

<LinkAccountParameters />
</Language>
</LanguageSelector>

## Learn more 

- Learn more about how to <ArrowLink text="link user accounts in Auth0" href="https://auth0.com/docs/manage-users/user-accounts/user-account-linking/link-user-accounts" newTab={false}/>
- Learn more about how to <ArrowLink text="unlink user accounts in Auth0" href="https://auth0.com/docs/manage-users/user-accounts/user-account-linking/unlink-user-accounts" newTab={false}/>
