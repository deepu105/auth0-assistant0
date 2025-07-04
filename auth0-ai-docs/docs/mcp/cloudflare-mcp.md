---
id: cloudflare-mcp
title: Cloudflare MCP Servers
description: Learn how to use Auth0 and Cloudflare to secure MCP servers.
slug: /cloudflare-mcp
hide_table_of_contents: true
---

import ArrowLink from "@site/src/components/ArrowLink";

# Secure MCP Servers with Auth0 and Cloudflare

Auth0 has collaborated with Cloudflare to help developers secure remote MCP servers powered by <ArrowLink text="Cloudflare Workers" href="https://developers.cloudflare.com/workers/"/>. With the pace of MCP adoption rapidly increasing, Cloudflare has <ArrowLink text="added features to its platform" href="https://blog.cloudflare.com/remote-model-context-protocol-servers-mcp/"/> that handle the hard parts of building remote MCP servers, like `workers-oauth-provider`, an OAuth Provider that makes authorization easy. By securing your MCP server with Auth0, AI applications can now interact with an external API by connecting through the remote MCP server and make API calls on behalf of an authenticated user.

 ## Sample App for Securing an MCP Server and API
Learn how to set up and use an AI application to connect with a sample Todos API using an MCP server secured by Auth0. The server and API are Cloudflare Workers projects and will use Auth0 to request and receive access and refresh tokens.

![MCP Server Auth](/img/mcp_auth_flow.png)

<ArrowLink text="See all the steps and the full details in this blog post" href="https://auth0.com/blog/secure-and-deploy-remote-mcp-servers-with-auth0-and-cloudflare/"/>