'use server';

import {
  generateLyrics,
  type GenerateLyricsInput,
} from '@/ai/flows/lyric-generation';
import { generateAudio, type GenerateAudioInput } from '@/ai/flows/tts-flow';

export type LyricGenerationResult = {
  lyrics?: string;
  genre?: string;
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

    return { lyrics: lyricResult.lyrics, genre: lyricResult.genre };
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
  data: GenerateAudioInput
): Promise<AcapellaGenerationResult> {
  try {
    // Remove section headers like [Verse], [Chorus] before sending to TTS
    const cleanedLyrics = data.lyrics.replace(/\[.*?\]\n?/g, '');
    const audioResult = await generateAudio({
      lyrics: cleanedLyrics,
      voice: data.voice,
    });
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
