'use server';

import {
  generateLyrics,
  type GenerateLyricsInput,
} from '@/ai/flows/lyric-generation';

export type LyricGenerationResult = {
  lyrics?: string;
  error?: string;
};

export async function handleGenerateLyrics(
  data: GenerateLyricsInput
): Promise<LyricGenerationResult> {
  try {
    const inputData = { ...data };

    // If spotifyUrl is an empty string, delete it from the object so it doesn't
    // fail Zod validation in the Genkit flow which expects a valid URL or undefined.
    if (inputData.spotifyUrl === '') {
      delete inputData.spotifyUrl;
    }

    const result = await generateLyrics(inputData);
    if (result.lyrics) {
      return { lyrics: result.lyrics };
    }
    return { error: 'Failed to generate lyrics. The result was empty.' };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `An error occurred while generating lyrics: ${errorMessage}` };
  }
}
