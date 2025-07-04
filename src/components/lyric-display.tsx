"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2, Mic, Drum } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface LyricDisplayProps {
  lyrics: string;
  audioDataUri?: string;
  beatAudioDataUri?: string;
  onGenerateAcapella: (lyrics: string) => void;
  isGeneratingAcapella: boolean;
  onGenerateBeat: () => void;
  isGeneratingBeat: boolean;
}

export function LyricDisplay({
  lyrics,
  audioDataUri,
  beatAudioDataUri,
  onGenerateAcapella,
  isGeneratingAcapella,
  onGenerateBeat,
  isGeneratingBeat,
}: LyricDisplayProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(lyrics);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  const formatLyrics = (text: string) => {
    return text.split("\n").map((line, index) => {
      const isSectionHeader =
        line.trim().startsWith("[") && line.trim().endsWith("]");
      if (isSectionHeader) {
        return (
          <h3
            key={index}
            className="font-headline text-xl font-bold tracking-wide mt-6 mb-2 text-primary uppercase"
          >
            {line.trim().replace(/[\[\]]/g, "")}
          </h3>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="my-1">
          {line}
        </p>
      );
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Card className="w-full animate-in fade-in-0 slide-in-from-bottom-10 duration-700 ease-out shadow-2xl border border-primary/20 bg-card/60 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-headline text-2xl">
          Your Masterpiece
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          aria-label="Copy lyrics"
        >
          {hasCopied ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {audioDataUri ? (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Acapella
                </h4>
                <audio controls src={audioDataUri} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <Button
                onClick={() => onGenerateAcapella(lyrics)}
                disabled={isGeneratingAcapella || isGeneratingBeat}
                className="w-full"
              >
                {isGeneratingAcapella ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Acapella...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Generate Acapella
                  </>
                )}
              </Button>
            )}
          </div>
          <div>
            {beatAudioDataUri ? (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Beat
                </h4>
                <audio controls src={beatAudioDataUri} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <Button
                onClick={onGenerateBeat}
                disabled={isGeneratingBeat || isGeneratingAcapella}
                className="w-full"
                variant="secondary"
              >
                {isGeneratingBeat ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Beat...
                  </>
                ) : (
                  <>
                    <Drum className="mr-2 h-5 w-5" />
                    Generate Beat
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[40vh] pr-4">
          <div className="whitespace-pre-wrap font-body text-base md:text-lg leading-relaxed text-foreground/90">
            {formatLyrics(lyrics)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
