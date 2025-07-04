'use server';

import {
  generateLyrics,
  type GenerateLyricsInput,
} from '@/ai/flows/lyric-generation';
import { stripe } from '@/lib/stripe';

export type LyricGenerationResult = {
  lyrics?: string;
  error?: string;
};

export async function handleGenerateLyrics(
  data: GenerateLyricsInput
): Promise<LyricGenerationResult> {
  try {
    const inputData = { ...data };

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

export async function createCheckoutSession(): Promise<{ url: string | null; error?: string }> {
  try {
    if (!stripe) {
      return { url: null, error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env file.' };
    }
    
    const priceId = process.env.STRIPE_PRICE_ID;
    const origin = process.env.NEXT_PUBLIC_URL;
    
    if (!priceId) {
      return { url: null, error: 'Stripe Price ID is not set. Please check your .env file.' };
    }

    if (!origin) {
      return { url: null, error: 'NEXT_PUBLIC_URL is not set. Please check your .env file.' };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/?pro=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    if (session.url) {
      return { url: session.url };
    }
    return { url: null, error: 'Failed to create Stripe checkout session.' };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { url: null, error: `An error occurred: ${errorMessage}` };
  }
}
