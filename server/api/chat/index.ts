import { streamText } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { Innertube } from 'youtubei.js';

const getYouTubeCaptionsTool = {
  name: 'getYouTubeCaptions',
  description: 'Fetches captions from a YouTube video',
  parameters: z.object({
    videoId: z.string().min(11).max(11),
  }),
  execute: async ({ videoId }: { videoId: string }) => {
    if (!videoId || videoId.length !== 11) {
      return 'Invalid video ID. Please provide a valid YouTube video ID.';
    }
    try {
      const yt = await Innertube.create();
      const video = await yt.getInfo(videoId);
      console.log('Video info:', video.captions);
      const captions = video.captions?.caption_tracks?.[0].base_url;
      if (!captions) {
        return 'No captions available for this video.';
      }
      const res = await fetch(captions);
      if (!res.ok) {
        return 'Failed to fetch captions.';
      }
      const text = await res.text();
      return text;
    } catch (error) {
      console.error('Error fetching YouTube captions:', error);
      return 'Failed to fetch captions.';
    }
  },
};

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
      tools: {
        getYouTubeCaptions: getYouTubeCaptionsTool,
      },
      maxSteps: 10,
    });

    return result.toDataStreamResponse();
  });
});
