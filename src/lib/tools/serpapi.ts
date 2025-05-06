import { tool } from 'ai';
import { z } from 'zod';
import { SerpAPI } from '@langchain/community/tools/serpapi';

const serpApi = new SerpAPI();

export const serpApiTool = tool({
  description: serpApi.description,
  parameters: z.object({
    q: z.string(),
  }),
  execute: async ({ q }) => {
    return await serpApi._call(q);
  },
});
