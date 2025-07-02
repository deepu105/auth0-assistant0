---
id: google-sign-in-and-auth
title: Google Sign-in and Authorization
description: Learn how to set up a Google social connection
slug: /google-sign-in-and-auth
sidebar_position: 12
hide_table_of_contents: true
---

# Google Sign-in and Authorization

import Card from "@site/src/components/Card";
import ArrowLink from "@site/src/components/ArrowLink";

Google is a popular social connection that allows users to log in to your application using their Google profile. To complete the [Call other's APIs on user's behalf quickstart](call-others-apis-on-users-behalf), you need to set up a Google social connection. 

To set up a Google social connection, you must:

- Create Google OAuth credentials with the Google Auth Platform.
- Configure and test a Google social connection with the Auth0 Dashboard. 

## Prerequisites

1. [Sign up for a Google Developer account](https://console.developers.google.com/).
2. [Create a Google project](https://support.google.com/googleapi/answer/6251787?ref_topic=7014522).

## Google Auth Platform

The Google Auth Platform helps you manage your applications and OAuth credentials for logging in and calling Google APIs. To learn more, read [Get started with the Google Auth Platform](https://support.google.com/cloud/answer/15544987?hl=en). 

Use the Google Auth Platform to:

- [Configure Google consent screen](#configure-google-consent-screen)
- [Create Google OAuth Client](#create-google-oauth-client)

### Configure Google consent screen

:::note 

If your application requests sensitive OAuth scopes or uses a custom image, [Google limits it to 100 logins until the OAuth consent screen is verified](https://developers.google.com/apps-script/guides/client-verification). Consent screen verification may take up to several days.

:::

When you use OAuth 2.0 for authorization, your application requests authorization for one or more scopes of access from a Google Account. Google displays a consent screen to the user, including a summary of your project, its policies, and the requested access scopes.

Before creating an OAuth client ID, you must first configure the OAuth consent screen with information about your application.

In the Google Cloud Console, [configure your Google OAuth consent screen](https://developers.google.com/workspace/guides/configure-oauth-consent):

1. Navigate to **Google Auth Platform > Branding**:
- For Authorized domains, enter `auth0.com`. If you’re using a [custom domain](https://auth0.com/docs/customize/custom-domains), enter your custom domain instead.

2. Navigate to **Google Auth Platform > Audience**:
- For **User type**, select **Make External**. In **Test Users**, you can add the email addresses you want to use for testing.  

3. Navigate to **Google Auth Platform > Data Access** to add or remove scopes. To learn more, read [OAuth 2.0 Scopes for Google APIs](https://developers.google.com/identity/protocols/oauth2/scopes). 

4. Follow the rest of the instructions to finish [configuring your Google OAuth consent screen](https://developers.google.com/workspace/guides/configure-oauth-consent).

5. Select **Save Changes**.

### Create Google OAuth Client

To create a Google OAuth 2.0 Client, you need your Auth0 domain, which you can find in the Auth0 Dashboard. 

1. If you haven’t configured a custom domain, your Auth0 domain name is `{YOUR_TENANT_NAME}.{YOUR_REGIONAL_SUBDOMAIN}.auth0.com`. It will be bolded in the introduction. Your redirect URI is `https://{YOUR_TENANT_NAME}.{YOUR_REGIONAL_SUBDOMAIN}.auth0.com/login/callback`.
3. If you have configured a custom domain via **Settings > Custom Domains** in your Auth0 Dashboard, use your custom domain instead. Your redirect URI is `https://{YOUR_CUSTOM_DOMAIN}/login/callback`.

**Note:** If you created your US tenant before June 2020, then your Auth0 domain name does not include the regional subdomain: `{YOUR_TENANT_NAME}.auth0.com`. 


In the Google Cloud Console, [create a new OAuth 2.0 Client](https://console.cloud.google.com/auth/clients/create):

1. Navigate to **Google Auth Platform > Clients**. Then, select **New Client**.
2. For the **Application type**, select **Web application**.
3. Enter the following information for your OAuth 2.0 Client:
- Name: The name of your OAuth 2.0 Client. 
- Authorized Javascript origins: `https://{YOUR_DOMAIN}`
- Authorized redirect URIs: `https://{YOUR_DOMAIN}/login/callback`
4. Select **Create**.

## Auth0 Dashboard

Use the Auth0 Dashboard to create and configure a Google social connection with the proper OAuth credentials. If you are following the [Call Other's APIs on User's Behalf](https://auth0.com/ai/docs/call-others-apis-on-users-behalf) quickstart, you can skip the below steps and proceed to get the connection automatically set up using the **Configure Google Social Connection** step of the quickstart.

### Create Google social connection

Use the Auth0 Dashboard to create a new Google social connection.

1. Navigate to **Authentication > Social**.
2. Select **Create Connection** and then **Google/Gmail**. 
3. In **General**, enter the client credentials from the Google OAuth 2.0 Client you created:
- Client ID: The unique identifier for your application. 
- Client Secret: The secret used by the application to authenticate with Auth0. To learn more, read [Client secret authentication](https://auth0.com/docs/secure/application-credentials#client-secret-authentication).
4. In **Permissions**, select all the required scopes. When you get an access token for the Google social connection, it will contain the appropriate scopes so you can use it to call the required Google APIs. 
5. Click **Save Changes**.

### Configure federated connection

You need to configure your Google social connection so it can retrieve and store access tokens for third-party APIs. Auth0's [Token Vault](https://auth0.com/docs/secure/tokens/token-vault) organizes the access and refresh tokens of federated connections in secure tokensets. Applications can then access the Token Vault to retrieve access tokens to call third-party APIs. 

To learn more, read [Configure Token Vault](https://auth0.com/docs/secure/tokens/token-vault/configure-token-vault). 

### Test connection

Once you have created your Google social connection, [test your connection](https://auth0.com/docs/dashboard/guides/connections/test-connections-social).

## Next steps

- Learn how to get an access token to make a tool call by completing the <ArrowLink text="Call other's APIs on user's behalf quickstart" href="call-others-apis-on-users-behalf" newTab={false}/>
- Learn more about using <ArrowLink text="Google for social login" href="https://developer.auth0.com/resources/labs/authentication/google-social-connection-to-login#introduction" newTab={false}/>. 