'use server';

import {
  generateLyrics,
  type GenerateLyricsInput,
  type GenerateLyricsOutput,
} from '@/ai/flows/lyric-generation';
import { generateAudio, type GenerateAudioInput } from '@/ai/flows/tts-flow';
import {
  generateAlbumArt,
  type GenerateAlbumArtInput,
} from '@/ai/flows/album-art-generation';

export type LyricGenerationResult = {
  lyrics?: string;
  genre?: string;
  analysis?: string;
  error?: string;
};

export type AcapellaGenerationResult = {
  audioDataUri?: string;
  error?: string;
};

export type AlbumArtGenerationResult = {
  albumArtDataUri?: string;
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

    const lyricResult: GenerateLyricsOutput = await generateLyrics(inputData);
    if (!lyricResult.lyrics) {
      return { error: 'Failed to generate lyrics. The result was empty.' };
    }

    return { 
      lyrics: lyricResult.lyrics, 
      genre: lyricResult.genre,
      analysis: lyricResult.analysis 
    };
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

export async function handleGenerateAlbumArt(
  data: GenerateAlbumArtInput
): Promise<AlbumArtGenerationResult> {
  try {
    const result = await generateAlbumArt(data);
    return {
      albumArtDataUri: result.albumArtDataUri,
    };
  } catch (e) {
    console.error(e);
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      error: `An error occurred while generating album art: ${errorMessage}`,
    };
  }
}
