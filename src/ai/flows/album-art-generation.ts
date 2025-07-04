'use server';

/**
 * @fileOverview An AI agent for generating album art based on a user's image.
 *
 * - generateAlbumArt - A function that handles the album art generation process.
 * - GenerateAlbumArtInput - The input type for the generateAlbumArt function.
 * - GenerateAlbumArtOutput - The return type for the generateAlbumArt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAlbumArtInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo from the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('A text prompt describing the desired style or theme for the album art, based on the song.'),
});
export type GenerateAlbumArtInput = z.infer<typeof GenerateAlbumArtInputSchema>;

const GenerateAlbumArtOutputSchema = z.object({
  albumArtDataUri: z.string().describe('The generated album art image as a data URI.'),
});
export type GenerateAlbumArtOutput = z.infer<typeof GenerateAlbumArtOutputSchema>;

export async function generateAlbumArt(
  input: GenerateAlbumArtInput
): Promise<GenerateAlbumArtOutput> {
  return generateAlbumArtFlow(input);
}

const generateAlbumArtFlow = ai.defineFlow(
  {
    name: 'generateAlbumArtFlow',
    inputSchema: GenerateAlbumArtInputSchema,
    outputSchema: GenerateAlbumArtOutputSchema,
  },
  async ({imageDataUri, prompt}) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        { media: { url: imageDataUri } },
        { text: `Turn this image into a creative, professional album cover for a song with the following theme: "${prompt}". Maintain the core subject of the image but reimagine it in an artistic style suitable for album art.` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return an image.');
    }

    return { albumArtDataUri: media.url };
  }
);
