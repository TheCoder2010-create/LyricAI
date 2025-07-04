'use server';
/**
 * @fileOverview A tool for searching Spotify.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const searchSpotifyTool = ai.defineTool(
  {
    name: 'searchSpotify',
    description: 'Search for a song on Spotify and get its details. Use this if the user provides a spotify URL.',
    inputSchema: z.object({
      url: z.string().describe('The Spotify URL of the song to search for.'),
    }),
    outputSchema: z.object({
      artist: z.string().describe('The artist of the song.'),
      song: z.string().describe('The name of the song.'),
      genre: z.string().describe('The genre of the song.'),
    }),
  },
  async (input) => {
    console.log(`[Spotify Tool] Searching for URL: ${input.url}`);
    // In a real application, you would implement a call to the Spotify API here.
    // For this prototype, we'll return mock data.
    if (input.url.toLowerCase().includes('taylor')) {
      return {
        artist: 'Taylor Swift',
        song: 'Cruel Summer',
        genre: 'Synth-pop',
      };
    }
    if (input.url.toLowerCase().includes('daft-punk')) {
        return {
            artist: 'Daft Punk',
            song: 'Get Lucky',
            genre: 'Disco',
        };
    }
    return {
      artist: 'Unknown Artist',
      song: 'Unknown Song',
      genre: 'Pop',
    };
  }
);
