---
id: list-github-repositories
title: List GitHub Repositories
description: Learn how to use Auth for GenAI SDKs to list your GitHub repositores.
slug: /list-github-repositories
hide_table_of_contents: true
---

# List GitHub Repositories

Use OpenAI, NextJS, and the Auth0-AI SDKs to list your GitHub repositores.

:::note
We value your feedback! To ask questions, report issues, or request new frameworks and providers, connect with us on [GitHub](https://github.com/auth0/auth-for-genai).
:::

import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import Card from "@site/src/components/Card";
import ArrowLink from "@site/src/components/ArrowLink";
import AISDKSample from './github/ai-sdk.md';
import CloudflareAgents from './github/cloudflare-agents.md';
import LangGraphJSSample from './github/langgraph.md';
import LangGraphSample from './github/langgraph-python.md';
import LlamaIndexSample from './github/llamaindex-python.md';
import NextJSAuth0Sample from './github/nextjs-auth0.md';
import GenKitSample from './github/genkit.md';
import LlamaIndexJSSample from './github/llamaindex.md';

<LanguageSelector title="language">
   <Language id="js" name="Javascript" icon="js.svg">

    <Card headerText="Prerequisites">
      Before using this example, make sure you:

      - Install Node.js 18+ and `npm`.
      - [Set up an OpenAI API key](https://platform.openai.com/docs/quickstart?api-mode=chat).
      - Complete the [User authentication quickstart](user-authentication) to create a Next.js app integrated with Auth0.
      - Create and configure a [GitHub App](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps).
      - Configure a [Social Connection for GitHub in Auth0](https://marketplace.auth0.com/integrations/github-social-connection)
        - Make sure to enable `Token Vault`
    </Card>

    <LanguageSelector>
      <Language id="js" name="AI SDK" icon="vercel.svg">
        <AISDKSample />
      </Language>

      <Language id="cloudflare" name="Cloudflare Agents" icon="cloudflare.svg">
        <CloudflareAgents />
      </Language>

      <Language id="langgraph" name="LangGraph" icon="langchain.svg">
        <LangGraphJSSample />
      </Language>

      <Language id="genkit" name="GenKit" icon="genkit.svg">
        <GenKitSample />
      </Language>

      <Language id="llamaindex" name="LlamaIndex" icon="llamadex.svg">
        <LlamaIndexJSSample />
      </Language>

      <Language id="nextjs-auth0" name="NextJS-Auth0" icon="nextjs.svg">
        <NextJSAuth0Sample />
      </Language>
    </LanguageSelector>

  </Language>

  <Language id="py" name="Python" icon="python.svg">

    <Card headerText="Prerequisites">
      Before using this example, make sure you:

      - Install Python 3.11+ and `pip`.
      - [Set up an OpenAI API key](https://platform.openai.com/docs/quickstart?api-mode=chat).
      - Configure a [Social Connection for GitHub in Auth0](https://marketplace.auth0.com/integrations/github-social-connection)
        - Make sure to enable `Token Vault`
    </Card>

    <LanguageSelector>
      <Language id="js" name="LangGraph" icon="langchain.svg">
        <LangGraphSample />
      </Language>

      <Language id="llamaindex" name="LlamaIndex" icon="llamadex.svg">
        <LlamaIndexSample />
      </Language>

      <Language id="crewai" name="CrewAI" icon="crew_ai.svg" disabled={true}>
        comming soon
      </Language>
    </LanguageSelector>

  </Language>
</LanguageSelector>


import AccountLinking from "./_partial/account-linking.mdx";

<AccountLinking connectionLabel="Github" />
