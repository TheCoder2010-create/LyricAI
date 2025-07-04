'use server';

import {
  generateLyrics,
  type GenerateLyricsInput,
} from '@/ai/flows/lyric-generation';
import { generateAudio } from '@/ai/flows/tts-flow';

export type LyricGenerationResult = {
  lyrics?: string;
  error?: string;
};

export type AcapellaGenerationResult = {
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

    return { lyrics: lyricResult.lyrics };
  } catch (e) {
    console.error(e);
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      error: `An error occurred while generating lyrics: ${errorMessage}`,
    };
  }
}

export async function handleGenerateAcapella(
  lyrics: string
): Promise<AcapellaGenerationResult> {
  try {
    const audioResult = await generateAudio({ lyrics });
    return {
      audioDataUri: audioResult.audioDataUri,
    };
  } catch (audioError) {
    console.error('Failed to generate audio:', audioError);
    const errorMessage =
      audioError instanceof Error
        ? audioError.message
        : 'An unknown error occurred.';
    return {
      error: `An error occurred while generating the acapella: ${errorMessage}`,
    };
  }
}
