'use server';

/**
 * @fileOverview A beat generation AI agent.
 *
 * - generateBeat - A function that handles the beat generation process.
 * - GenerateBeatInput - The input type for the generateBeat function.
 * - GenerateBeatOutput - The return type for the generateBeat function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';

const GenerateBeatInputSchema = z.object({
  genre: z.string().describe('The genre of the song to generate a beat for.'),
  topic: z
    .string()
    .describe('The topic of the song for additional context.')
    .optional(),
});
export type GenerateBeatInput = z.infer<typeof GenerateBeatInputSchema>;

const GenerateBeatOutputSchema = z.object({
  beatAudioDataUri: z
    .string()
    .describe('The generated beat audio as a data URI.'),
});
export type GenerateBeatOutput = z.infer<typeof GenerateBeatOutputSchema>;

export async function generateBeat(
  input: GenerateBeatInput
): Promise<GenerateBeatOutput> {
  return generateBeatFlow(input);
}

const beatboxPrompt = ai.definePrompt({
  name: 'generateBeatboxPrompt',
  input: { schema: GenerateBeatInputSchema },
  prompt: `You are a world-class beatbox machine. Your task is to generate a simple, rhythmic beatbox pattern that fits a specific music genre. Use only onomatopoeic words like "boots", "cats", "tss", "bmm", "pff", "k", and "ish". The generated pattern should be a single line of text and should create a loopable rhythm of about 10-15 seconds.

Genre: {{{genre}}}
{{#if topic}}Topic context: {{{topic}}}{{/if}}

Beatbox Pattern:`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateBeatFlow = ai.defineFlow(
  {
    name: 'generateBeatFlow',
    inputSchema: GenerateBeatInputSchema,
    outputSchema: GenerateBeatOutputSchema,
  },
  async (input) => {
    // 1. Generate the beatbox text pattern
    const beatboxResult = await beatboxPrompt(input);
    const beatboxPattern = beatboxResult.text;

    if (!beatboxPattern) {
      throw new Error('Failed to generate a beatbox pattern.');
    }

    // 2. Convert the beatbox pattern to audio using TTS
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: beatboxPattern,
    });

    if (!media) {
      throw new Error('No beat audio was returned from the AI model.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(audioBuffer);

    return {
      beatAudioDataUri: 'data:audio/wav;base64,' + wavData,
    };
  }
);
