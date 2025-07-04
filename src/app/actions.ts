'use server';

import {
  generateLyrics,
  type GenerateLyricsInput,
} from '@/ai/flows/lyric-generation';
import { generateAudio } from '@/ai/flows/tts-flow';
import { generateBeat, type GenerateBeatInput } from '@/ai/flows/beat-generation';

export type LyricGenerationResult = {
  lyrics?: string;
  genre?: string;
  error?: string;
};

export type AcapellaGenerationResult = {
  audioDataUri?: string;
  error?: string;
};

export type BeatGenerationResult = {
  beatAudioDataUri?: string;
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
  lyrics: string
): Promise<AcapellaGenerationResult> {
  try {
    // Remove section headers like [Verse], [Chorus] before sending to TTS
    const cleanedLyrics = lyrics.replace(/\[.*?\]\n?/g, '');
    const audioResult = await generateAudio({ lyrics: cleanedLyrics });
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

export async function handleGenerateBeat(
  data: GenerateBeatInput
): Promise<BeatGenerationResult> {
  try {
    const beatResult = await generateBeat(data);
    return {
      beatAudioDataUri: beatResult.beatAudioDataUri,
    };
  } catch (beatError) {
    console.error('Failed to generate beat:', beatError);
    const errorMessage =
      beatError instanceof Error
        ? beatError.message
        : 'An unknown error occurred.';
    return {
      error: `An error occurred while generating the beat: ${errorMessage}`,
    };
  }
}
