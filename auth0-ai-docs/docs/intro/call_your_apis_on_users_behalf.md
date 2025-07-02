---
id: call-your-apis-on-users-behalf
title: Call Your APIs on User's Behalf
description: Call Your APIs on User's Behalf
slug: /intro/call-your-apis
hide_table_of_contents: true
---

import Card from "@site/src/components/Card";

# Call Your APIs on User's Behalf

Once Auth0 is set up for User Authentication, you can enable your AI applications and AI agents to securely call your own APIs (first-party APIs) on behalf of authenticated users. This capability allows AI agents to access user-specific data or perform actions with explicit user consent and scope.

## Delegated authorization

The process relies on **delegated authorization**, where the user grants your AI application or AI agent permission to access protected resources without sharing their credentials directly. This is achieved through:

* **Access Tokens:** After a user authenticates, Auth0 issues an access token to your AI application. This token represents the user's consent and defines the scope of permissions granted.

*![][image3]*

**API on Auth0**

An API is an entity that represents an external resource, capable of accepting and responding to protected resource requests made by applications. These APIs are configured to accept and validate access tokens. To protect an API, it must be [registered as an API](https://auth0.com/docs/get-started/auth0-overview/set-up-apis) using the Auth0 Dashboard. 

#### **How It Works for AI Apps and Agents**

*![][image4]*

1. **User Authentication:** A user logs into your AI application or agent interface (e.g., via Universal Login).  
2. **Access Token Issuance:** Upon successful authentication, an access token is issued to your application.  
3. **AI Agent Makes a Tool Call:** When the AI agent needs to access user-specific data or perform an action, it makes a tool call to an  API endpoint.  
4. **Token Forwarding:** The access token obtained in step 2 is included in the API request (typically in the `Authorization` header).  
5. **API Validation & Response:** The API validates the access token. If valid, it processes the request on behalf of the user and returns the response to the AI agent.  
6. **AI Agent Receives and Processes the Information:** The AI agent then uses this response to fulfill the user's request.

### **Get Started**

To begin using Auth0 for calling your APIs in your GenAI applications, refer to the following resources:

* **Quickstarts:**  
  * [Call Your APIs On User's Behalf](https://auth0.com/ai/docs/call-your-apis-on-users-behalf)  
  *   
* **Guides:**  
  * ??  
* **Sample Apps:**  
  * ??

### **Learn More**

* [Auth0 Docs for APIs](https://auth0.com/docs/get-started/apis)


## Get started

To begin using Auth0 authentication in your GenAI applications, refer to the following resources:

* **Quickstarts:**  
  * [User Authentication](https://auth0.com/ai/docs/user-authentication) for [Next.js](http://Next.js)    
  * [User Authentication](https://auth0.com/ai/docs/user-authentication) for FastAPI  
  * [Other official quickstarts](https://auth0.com/docs/quickstarts)    

## Learn more

* [Auth0 Docs](https://auth0.com/docs/articles)  
* [Authentication API](https://auth0.com/docs/api/authentication)  
* [SDKs](https://auth0.com/docs/libraries)


