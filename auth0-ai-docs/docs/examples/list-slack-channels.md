---
id: list-slack-channels
title: List Slack Channels
description: Learn how to use Auth for GenAI SDKs to list your Slack channels.
slug: /list-slack-channels
hide_table_of_contents: true
---

# List Slack Channels

Use OpenAI, NextJS, and the Auth0-AI SDKs to list your Slack channels.

:::note
We value your feedback! To ask questions, report issues, or request new frameworks and providers, connect with us on [GitHub](https://github.com/auth0/auth-for-genai).
:::

import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import Card from "@site/src/components/Card";
import ArrowLink from "@site/src/components/ArrowLink";
import AISDKSample from './slack/ai-sdk.md';
import CloudflareAgents from './slack/cloudflare-agents.md';
import LangGraphJSSample from './slack/langgraph.md';
import LangGraphSample from './slack/langgraph-python.md';
import LlamaIndexSample from './slack/llamaindex-python.md';
import GenKitSample from './slack/genkit.md';
import LlamaIndexJSSample from './slack/llamaindex.md';

<LanguageSelector title="language">
   <Language id="js" name="Javascript" icon="js.svg">

    <Card headerText="Prerequisites">
      Before using this example, make sure you:

      - Install Node.js 18+ and `npm`.
      - [Set up an OpenAI API key](https://platform.openai.com/docs/quickstart?api-mode=chat).
      - Complete the [User authentication quickstart](user-authentication) to create a Next.js app integrated with Auth0.
      - Configure a [Social Connection for Slack in Auth0](https://marketplace.auth0.com/integrations/sign-in-with-slack)
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
    </LanguageSelector>

  </Language>

  <Language id="py" name="Python" icon="python.svg">

    <Card headerText="Prerequisites">
      Before using this example, make sure you:

      - Install Python 3.11+ and `pip`.
      - [Set up an OpenAI API key](https://platform.openai.com/docs/quickstart?api-mode=chat).
      - Configure a [Social Connection for Slack in Auth0](https://marketplace.auth0.com/integrations/sign-in-with-slack)
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

<AccountLinking connectionLabel="Slack" />
