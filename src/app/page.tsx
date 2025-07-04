"use client";

import { useState } from 'react';
import { Loader2, Mic, Music, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleGenerateLyrics, type LyricGenerationResult } from '@/app/actions';
import { LyricForm } from '@/components/lyric-form';
import { LyricDisplay } from '@/components/lyric-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Home() {
  const [result, setResult] = useState<LyricGenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onGenerate = async (data: { topic: string; genre: string }) => {
    setIsLoading(true);
    setResult(null);
    const generationResult = await handleGenerateLyrics(data);
    setResult(generationResult);
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
                <Music className="h-10 w-10 text-primary" />
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                    LyricAI
                </h1>
                <Mic className="h-10 w-10 text-primary" />
            </div>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Unleash your inner songwriter. Generate original lyrics for any topic and genre with the power of AI.
          </p>
        </div>

        <Card className="w-full shadow-lg border-2 border-primary/10">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-center">Create Your Song</CardTitle>
            </CardHeader>
            <CardContent>
                <LyricForm onSubmit={onGenerate} isLoading={isLoading} />
            </CardContent>
        </Card>

        {isLoading && (
            <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-card p-8 text-center shadow-md">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-muted-foreground">Generating your masterpiece...</p>
                <p className="text-sm text-muted-foreground">This can take a few moments.</p>
            </div>
        )}

        {result?.error && (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>
                    {result.error}
                </AlertDescription>
            </Alert>
        )}

        {result?.lyrics && (
            <LyricDisplay lyrics={result.lyrics} />
        )}
      </div>
    </main>
  );
}
