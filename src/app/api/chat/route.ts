import { NextRequest, NextResponse } from 'next/server';
import { type Message, LangChainAdapter } from 'ai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage } from '@langchain/core/messages';
import { Calculator } from '@langchain/community/tools/calculator';
import { SerpAPI } from '@langchain/community/tools/serpapi';
import { GmailSearch } from '@langchain/community/tools/gmail';
import { GmailCreateDraft } from '@langchain/community/tools/gmail';
import { GoogleCalendarCreateTool, GoogleCalendarViewTool } from '@langchain/community/tools/google_calendar';

// import { getGoogleAccessToken } from '@/lib/auth0';
import { getAccessTokenForConnection } from '@auth0/ai-langchain';
import { Auth0AI } from '@auth0/ai-langchain';

import { convertVercelMessageToLangChainMessage } from '@/utils/message-converters';
import { logToolCallsInDevelopment } from '@/utils/stream-logging';
import { DynamicStructuredTool } from '@langchain/core/tools';

const AGENT_SYSTEM_TEMPLATE = `You are a personal assistant named Assistant0. You are a helpful assistant that can answer questions and help with tasks. You have access to a set of tools, use the tools as needed to answer the user's question. Render the email body as a markdown block, do not wrap it in code blocks.`;

const auth0AI = new Auth0AI();

const withGoogleConnection = auth0AI.withTokenForConnection({
  connection: 'google-oauth2',
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://mail.google.com/',
  ],
});

const getGoogleAccessToken = async () => {
  // Get the access token via Auth0
  const credentials = getAccessTokenForConnection();
  return credentials?.accessToken!;
};
/**
 * This handler initializes and calls an tool calling ReAct agent.
 * See the docs for more information:
 *
 * https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    /**
     * We represent intermediate steps as system messages for display purposes,
     * but don't want them in the chat history.
     */
    const messages = (body.messages ?? [])
      .filter((message: Message) => message.role === 'user' || message.role === 'assistant')
      .map(convertVercelMessageToLangChainMessage);

    const llm = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0,
    });

    // Provide the access token to the Gmail tools
    const gmailParams = {
      credentials: {
        accessToken: getGoogleAccessToken,
      },
    };

    const googleCalendarParams = {
      credentials: {
        accessToken: getGoogleAccessToken,
        calendarId: 'primary',
      },
      model: llm,
    };

    const tools = [
      new Calculator(),
      // Requires process.env.SERPAPI_API_KEY to be set: https://serpapi.com/
      new SerpAPI(),
      withGoogleConnection(new GmailSearch(gmailParams) as unknown as DynamicStructuredTool),
      withGoogleConnection(new GmailCreateDraft(gmailParams) as unknown as DynamicStructuredTool),
      withGoogleConnection(new GoogleCalendarCreateTool(googleCalendarParams) as unknown as DynamicStructuredTool),
      withGoogleConnection(new GoogleCalendarViewTool(googleCalendarParams) as unknown as DynamicStructuredTool),
    ];
    /**
     * Use a prebuilt LangGraph agent.
     */
    const agent = createReactAgent({
      llm,
      tools,
      /**
       * Modify the stock prompt in the prebuilt agent. See docs
       * for how to customize your agent:
       *
       * https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/
       */
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    });

    /**
     * Stream back all generated tokens and steps from their runs.
     *
     * See: https://langchain-ai.github.io/langgraphjs/how-tos/stream-tokens/
     */
    const eventStream = agent.streamEvents({ messages }, { version: 'v2' });

    // Log tool calling data. Only in development mode
    const transformedStream = logToolCallsInDevelopment(eventStream);
    // Adapt the LangChain stream to Vercel AI SDK Stream
    return LangChainAdapter.toDataStreamResponse(transformedStream);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
