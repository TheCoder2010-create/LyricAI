'use server';

/**
 * @fileOverview A lyric generation AI agent.
 *
 * - generateLyrics - A function that handles the lyric generation process.
 * - GenerateLyricsInput - The input type for the generateLyrics function.
 * - GenerateLyricsOutput - The return type for the generateLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchSpotifyTool } from '@/ai/tools/spotify';

const GenerateLyricsInputSchema = z.object({
  topic: z.string().describe('The topic of the song lyrics.').optional(),
  genre: z.string().describe('The preferred music genre for the song lyrics.').optional(),
  spotifyUrl: z.string().url('Please provide a valid Spotify URL.').describe('A spotify URL to a song to use as inspiration.').optional(),
});
export type GenerateLyricsInput = z.infer<typeof GenerateLyricsInputSchema>;

const GenerateLyricsOutputSchema = z.object({
  lyrics: z.string().describe('The generated song lyrics.'),
  genre: z.string().describe("The resolved genre of the song. If a genre was provided in the request, use that. If a Spotify URL was used, use the genre returned by the tool."),
});
export type GenerateLyricsOutput = z.infer<typeof GenerateLyricsOutputSchema>;

export async function generateLyrics(input: GenerateLyricsInput): Promise<GenerateLyricsOutput> {
  return generateLyricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLyricsPrompt',
  input: {schema: GenerateLyricsInputSchema},
  output: {schema: GenerateLyricsOutputSchema},
  tools: [searchSpotifyTool],
  prompt: `You are a song lyric generator. 
  
  Generate song lyrics based on the user's request.
  
  If the user provides a Spotify URL, you MUST use the searchSpotify tool to get details about the song and use that as inspiration for the topic, genre, and style of the lyrics.
  
  If they provide a topic and genre directly, use those.

  User Request:
  {{#if spotifyUrl}}Spotify URL: {{{spotifyUrl}}}{{/if}}
  {{#if topic}}Topic: {{{topic}}}{{/if}}
  {{#if genre}}Genre: {{{genre}}}{{/if}}
  
  Lyrics:`,
});

const generateLyricsFlow = ai.defineFlow(
  {
    name: 'generateLyricsFlow',
    inputSchema: GenerateLyricsInputSchema,
    outputSchema: GenerateLyricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
