---
id: check-google-calendar-availability
title: Check Google Calendar Availability
description: Learn how to use Auth for GenAI SDKs to check your Google Calendar availability.
slug: /check-google-calendar-availability
hide_table_of_contents: true
---

# Check Google Calendar Availability

Use OpenAI, NextJS, and the Auth0-AI SDKs to check your Google Calendar availability.

import LanguageSelector from "@site/src/components/LanguageSelector";
import Language from "@site/src/components/LanguageSelector/Language";
import Card from "@site/src/components/Card";
import ArrowLink from "@site/src/components/ArrowLink";
import AISDKSample from './google-calendar/ai-sdk.md';
import CloudflareAgents from './google-calendar/cloudflare-agents.md';
import LangGraphJSSample from './google-calendar/langgraph.md';
import LangGraphSample from './google-calendar/langgraph-python.md';
import LlamaIndexSample from './google-calendar/llamaindex-python.md';
import NextJSAuth0Sample from './google-calendar/nextjs-auth0.md';
import GenKitSample from './google-calendar/genkit.md';
import LlamaIndexJSSample from './google-calendar/llamaindex.md';

<LanguageSelector title="language">
  <Language id="js" name="Javascript" icon="js.svg">

    <Card headerText="Prerequisites">
      Before using this example, make sure you:

      - Install Node.js 18+ and `npm`.
      - [Set up an OpenAI API key](https://platform.openai.com/docs/quickstart?api-mode=chat).
      - Complete the [User authentication quickstart](user-authentication) to create a Next.js app integrated with Auth0.
      - Set up and configure a Google Cloud project:
        - Enable the [Google Calendar API](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com).
        - Create OAuth 2.0 credentials (Web Application) with proper redirect URIs.
      - Configure a [Social Connection for Google in Auth0](https://marketplace.auth0.com/integrations/google-social-connection)
        - Make sure to enable `Token Vault`
        - Select `Offline Access` scope

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
      - Configure a [Social Connection for Google in Auth0](https://marketplace.auth0.com/integrations/google-social-connection)
        - Make sure to enable `Token Vault`
        - Select `Offline Access` scope
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

<AccountLinking connectionLabel="Google" />
