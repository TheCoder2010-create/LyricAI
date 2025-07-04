"use client";

import { useState } from 'react';
import { Loader2, Terminal, Wand2, Star, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  handleGenerateLyrics,
  handleGenerateAcapella,
  handleGenerateAlbumArt,
  type LyricGenerationResult,
} from '@/app/actions';
import { LyricForm } from '@/components/lyric-form';
import { LyricDisplay } from '@/components/lyric-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { GenerateLyricsInput } from '@/ai/flows/lyric-generation';
import { Header } from '@/components/header';
import { AlbumArtCreator } from '@/components/album-art-creator';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Home() {
  const [result, setResult] = useState<LyricGenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | undefined>(
    undefined
  );
  const [isGeneratingAcapella, setIsGeneratingAcapella] = useState(false);
  const [songContext, setSongContext] = useState<{
    lyrics?: string;
    genre?: string;
    topic?: string;
    analysis?: string;
  }>({});
  const [selectedVoice, setSelectedVoice] = useState('Algenib');

  const [albumArtResult, setAlbumArtResult] = useState<{
    dataUri?: string;
    error?: string;
  }>({});
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);

  // Monetization state
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const onGenerate = async (data: GenerateLyricsInput) => {
    setIsLoading(true);
    setResult(null);
    setAudioDataUri(undefined);
    setSongContext({});
    setAlbumArtResult({}); 

    const generationResult = await handleGenerateLyrics(data);
    setResult(generationResult);
    if (generationResult.lyrics) {
      setSongContext({
        lyrics: generationResult.lyrics,
        genre: generationResult.genre,
        topic: data.topic,
        analysis: generationResult.analysis,
      });
    }
    setIsLoading(false);
  };

  const onGenerateAcapella = async (lyrics: string) => {
    setIsGeneratingAcapella(true);
    setResult({ ...result, error: undefined }); 
    const acapellaResult = await handleGenerateAcapella({
      lyrics,
      voice: selectedVoice,
    });
    if (acapellaResult.audioDataUri) {
      setAudioDataUri(acapellaResult.audioDataUri);
    }
    if (acapellaResult.error) {
      setResult({ ...songContext, error: acapellaResult.error });
    }
    setIsGeneratingAcapella(false);
  };

  const onGenerateAlbumArt = async (imageDataUri: string) => {
    if (!songContext.topic && !songContext.genre) {
      setResult({ ...result, error: 'Cannot generate art without song context (topic or genre).' });
      return;
    }
    setIsGeneratingArt(true);
    setAlbumArtResult({});
    setResult({ ...result, error: undefined }); 

    const prompt = `A song about ${songContext.topic || 'an unknown topic'} in the ${songContext.genre || 'general pop'} style.`;
    
    const res = await handleGenerateAlbumArt({ imageDataUri, prompt });

    if (res.albumArtDataUri) {
      setAlbumArtResult({ dataUri: res.albumArtDataUri });
    }
    if (res.error) {
      setResult({ ...result, error: res.error });
    }
    setIsGeneratingArt(false);
  };

  const handleUpgrade = () => {
    setIsPro(true);
    setShowUpgradeDialog(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <Header isPro={isPro} onUpgradeClick={() => setShowUpgradeDialog(true)}/>
        <main className="relative flex flex-grow flex-col items-center justify-start pt-12 pb-24 overflow-y-auto px-4 sm:px-6 lg:px-8">
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
                <LyricForm 
                  onSubmit={onGenerate} 
                  isLoading={isLoading} 
                  isPro={isPro}
                  onUpgradeClick={() => setShowUpgradeDialog(true)}
                />
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
              <>
              <LyricDisplay
                lyrics={result.lyrics}
                analysis={result.analysis}
                audioDataUri={audioDataUri}
                onGenerateAcapella={onGenerateAcapella}
                isGeneratingAcapella={isGeneratingAcapella}
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                isPro={isPro}
                onUpgradeClick={() => setShowUpgradeDialog(true)}
              />
              <AlbumArtCreator 
                onGenerate={onGenerateAlbumArt}
                isGenerating={isGeneratingArt}
                result={albumArtResult}
                isPro={isPro}
                onUpgradeClick={() => setShowUpgradeDialog(true)}
              />
              </>
            )}
          </div>
        </main>
      </div>

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              Upgrade to LyricAI Pro
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-4" asChild>
              <div>
                Unlock powerful features to take your songwriting to the next level:
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li><span className="font-bold">AI Album Art Generator:</span> Turn your photos into unique album covers.</li>
                  <li><span className="font-bold">Spotify Song Inspiration:</span> Get lyric ideas from your favorite tracks.</li>
                  <li><span className="font-bold">AI Songwriting Coach:</span> Receive analysis on your song's structure and theme.</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpgrade} className="bg-primary hover:bg-primary/90">
              Upgrade Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
