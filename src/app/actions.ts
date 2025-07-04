'use server';

import {
  generateLyrics,
  type GenerateLyricsInput,
} from '@/ai/flows/lyric-generation';
import { generateAudio } from '@/ai/flows/tts-flow';

export type LyricGenerationResult = {
  lyrics?: string;
  audioDataUri?: string;
  error?: string;
};

export async function handleGenerateLyrics(
  data: GenerateLyricsInput
): Promise<LyricGenerationResult> {
  try {
    const inputData = { ...data };

    if (inputData.spotifyUrl === '' || inputData.spotifyUrl === undefined) {
      delete inputData.spotifyUrl;
    }

    const lyricResult = await generateLyrics(inputData);
    if (!lyricResult.lyrics) {
      return { error: 'Failed to generate lyrics. The result was empty.' };
    }

    try {
      const audioResult = await generateAudio({ lyrics: lyricResult.lyrics });
      return {
        lyrics: lyricResult.lyrics,
        audioDataUri: audioResult.audioDataUri,
      };
    } catch (audioError) {
      console.error('Failed to generate audio:', audioError);
      // Fail gracefully, just return the lyrics without audio
      return { lyrics: lyricResult.lyrics };
    }
  } catch (e) {
    console.error(e);
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      error: `An error occurred while generating lyrics: ${errorMessage}`,
    };
  }
}
