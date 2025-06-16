import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().public.openaiApiKey;
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const openai = createOpenAI({
    apiKey: apiKey,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return defineEventHandler(async (event: any) => {
    const { messages } = await readBody(event);

    const result = streamText({
      model: openai('gpt-4o'),
      messages,
    });

    return result.toDataStreamResponse();
  });
});
