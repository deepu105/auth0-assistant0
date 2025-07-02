---
id: auth-for-mcp
title: Auth for MCP
description: Auth for MCP Servers
slug: /auth-for-mcp
sidebar_position: 5
hide_table_of_contents: true
---

# Auth for MCP Servers

For developers building applications that use AI agents to interact with external systems, standardizing how these agents call tools is a significant challenge. The Model Context Protocol (MCP) provides a specification for this interaction. This guide gives a technical overview of MCP and explains how to implement robust authentication and authorization for MCP servers using Auth0.

## What is the Model Context Protocol (MCP)?

[MCP is an open standard](https://modelcontextprotocol.io), developed by Anthropic, that specifies a common interface for AI agents and Large Language Models (LLMs) to communicate with tools. It's designed to solve the problem of tool discovery and interaction in a standardized way.
MCP supports networked environments using HTTP and Server-Sent Events (SSE). This allows an AI agent to interact with tools hosted on remote servers across the internet. For developers building AI applications, MCP offers practical advantages:

  - **Standardized Interfaces:** MCP provides common patterns for tool definitions. This reduces the need for custom integration code for each LLM provider, allowing you to swap backends to optimize for cost or performance with less refactoring.
  - **LLM-Optimized Tool Definitions:** The protocol acknowledges that APIs for LLMs differ from traditional developer APIs. LLM-facing tools require richer descriptive context and metadata for the model to use them effectively, a distinction MCP incorporates into its design.
  - **Reusable Components:** Growing adoption means access to a larger ecosystem of MCP-compliant tools and resources. This allows developers to leverage existing, tested components rather than building everything from scratch.


## Authentication and Authorization for MCP Servers

When an MCP server is exposed to the internet, it must be secured. The MCP specification recommends using [OAuth 2.1](https://oauth.net/2.1/) to secure these interactions. This allows an MCP server to delegate authentication to a dedicated authorization server and manage access control for different clients, users, and actions using scopes.

## Implementing MCP Security with Auth0

By using Auth0 as your authorization server, you can secure your MCP server without building and maintaining a complex identity system yourself. The MCP specification highlights several key OAuth 2.1 features that Auth0 provides:

  - **Proof Key for Code Exchange (PKCE):** A security feature that is mandatory for all clients in the spec. [PKCE](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce) mitigates the threat of authorization code interception and is handled automatically in Auth0's SDKs.
  - **Metadata Discovery:** The MCP spec encourages servers to advertise their OAuth endpoints. An Auth0 tenant provides a [standard discovery document](https://auth0.com/docs/get-started/applications/configure-applications-with-oidc-discovery) (`/.well-known/openid-configuration`) so MCP clients can dynamically find the required endpoints for authorization, token exchange, etc., reducing manual client-side configuration.
  - **Dynamic Client Registration (DCR):** DCR is crucial for scalability. It allows MCP clients (like a generic AI workbench) to programmatically register with your Auth0-secured MCP server via an API call. This avoids forcing users to manually create a client application in the Auth0 dashboard for every new tool they want to connect.
  - **Delegating Authentication to a Third-Party Identity Provider(IdP):** The specification supports delegating the user login process. You can configure your MCP server to use Auth0 as the trusted identity provider, centralizing user management and sign-on logic.

## MCP Authorization Flow with Auth0

Here is the standard OAuth authorization code flow when an MCP server uses Auth0 as its authorization server:

1. The MCP client initiates the OAuth flow by making a request to the MCP server's authorization endpoint.
2. The MCP server redirects the user to the Auth0 authorization server.
3. The user authenticates with Auth0 (using username/password, social login, or MFA).
4. After successful authentication, Auth0 redirects the browser back to the MCP server's callback URL with a single-use authorization code.
5. The MCP server exchanges the authorization code for an access token directly with the Auth0 token endpoint.
6. The MCP server validates the token from Auth0 and generates its own session or internal access token that is bound to the third-party session.
7. The MCP server completes the original OAuth flow, returning its own token to the MCP client, which can then be used to make authenticated calls to the server's tools.

![MCP Server Auth](/img/mcp_auth_flow.png)
