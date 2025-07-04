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
  language: z.string().describe('The language for the song lyrics.').optional(),
  inspiredBy: z.string().describe("The singer or artist style to be inspired by.").optional(),
  spotifyUrl: z.string().url('Please provide a valid Spotify URL.').describe('A spotify URL to a song to use as inspiration.').optional(),
});
export type GenerateLyricsInput = z.infer<typeof GenerateLyricsInputSchema>;

const GenerateLyricsOutputSchema = z.object({
  lyrics: z.string().describe('The generated song lyrics.'),
  genre: z.string().describe("The resolved genre of the song. If a genre was provided in the request, use that. If a Spotify URL was used, use the genre returned by the tool."),
  analysis: z.string().describe("A brief analysis of the song's structure, theme, and mood, as if written by a songwriting coach."),
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
  prompt: `You are a professional songwriter and lyricist, known for your ability to craft emotionally resonant and vivid narratives. Your task is to write song lyrics that are creative, well-structured, and suitable for a professional music artist.

  Please adhere to the following guidelines:
  - Structure the song with clear sections like [Verse], [Chorus], [Bridge], etc.
  - Use strong imagery and sensory details to paint a picture for the listener.
  - Develop a consistent theme and narrative throughout the lyrics.
  - Ensure the lyrics have a natural rhythm and flow.
  
  Generate song lyrics based on the user's request.
  
  If the user provides a Spotify URL, you MUST use the searchSpotify tool to get details about the song and use that as inspiration for the topic, genre, and style of the lyrics.
  
  If they provide a topic, genre, or artist to be inspired by, use those.

  {{#if language}}Write the lyrics in {{{language}}}.{{/if}}

  User Request:
  {{#if spotifyUrl}}Spotify URL: {{{spotifyUrl}}}{{/if}}
  {{#if topic}}Topic: {{{topic}}}{{/if}}
  {{#if genre}}Genre: {{{genre}}}{{/if}}
  {{#if inspiredBy}}Inspired by the style of: {{{inspiredBy}}}{{/if}}
  
  Lyrics:
  
  ---
  
  After generating the lyrics, provide a brief, insightful analysis of the song you've written. Act as a songwriting coach, explaining the structure (e.g., AABA, verse-chorus), the core theme, and the mood.
  Analysis:`,
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
