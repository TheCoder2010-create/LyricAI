"use client";

import { useState } from 'react';
import { Loader2, Terminal, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  handleGenerateLyrics,
  handleGenerateAcapella,
  type LyricGenerationResult,
} from '@/app/actions';
import { LyricForm } from '@/components/lyric-form';
import { LyricDisplay } from '@/components/lyric-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { GenerateLyricsInput } from '@/ai/flows/lyric-generation';
import { Header } from '@/components/header';

export default function Home() {
  const [result, setResult] = useState<LyricGenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | undefined>(
    undefined
  );
  const [isGeneratingAcapella, setIsGeneratingAcapella] = useState(false);

  const onGenerate = async (data: GenerateLyricsInput) => {
    setIsLoading(true);
    setResult(null);
    setAudioDataUri(undefined);
    const generationResult = await handleGenerateLyrics(data);
    setResult(generationResult);
    setIsLoading(false);
  };

  const onGenerateAcapella = async (lyrics: string) => {
    setIsGeneratingAcapella(true);
    const acapellaResult = await handleGenerateAcapella(lyrics);
    if (acapellaResult.audioDataUri) {
      setAudioDataUri(acapellaResult.audioDataUri);
    }
    if (acapellaResult.error) {
      // Preserve existing lyrics when showing a new error
      setResult({ lyrics: result?.lyrics, error: acapellaResult.error });
    }
    setIsGeneratingAcapella(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="relative flex flex-grow flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
          <div
            className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#ffffff2e_1px,transparent_1px)]"
            aria-hidden="true"
          />
          <div className="mx-auto w-full max-w-2xl space-y-8">
            <Card className="w-full shadow-2xl border-primary/20 bg-card/80 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-500">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-center flex items-center justify-center gap-2">
                  <Wand2 className="h-6 w-6 text-primary" />
                  Create Your Song
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LyricForm onSubmit={onGenerate} isLoading={isLoading} />
              </CardContent>
            </Card>

            {isLoading && (
              <Card className="w-full shadow-2xl border-primary/20 bg-card/80 backdrop-blur-xl animate-in fade-in-0 duration-500">
                <CardContent className="p-8">
                  <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-xl font-bold text-foreground">
                      Generating your masterpiece...
                    </p>
                    <p className="text-md text-muted-foreground">
                      The AI is warming up. This might take a moment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {result?.error && (
              <Alert
                variant="destructive"
                className="animate-in fade-in-0 duration-500"
              >
                <Terminal className="h-4 w-4" />
                <AlertTitle>Uh oh! Something went wrong.</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            )}

            {result?.lyrics && (
              <LyricDisplay
                lyrics={result.lyrics}
                audioDataUri={audioDataUri}
                onGenerateAcapella={onGenerateAcapella}
                isGeneratingAcapella={isGeneratingAcapella}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
