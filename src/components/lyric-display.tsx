"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2, Mic } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface LyricDisplayProps {
  lyrics: string;
  audioDataUri?: string;
  onGenerateAcapella: (lyrics: string) => void;
  isGeneratingAcapella: boolean;
}

export function LyricDisplay({
  lyrics,
  audioDataUri,
  onGenerateAcapella,
  isGeneratingAcapella,
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
        {audioDataUri ? (
          <div className="mb-4">
            <audio controls src={audioDataUri} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <div className="mb-4">
            <Button
              onClick={() => onGenerateAcapella(lyrics)}
              disabled={isGeneratingAcapella}
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
                  Convert to Voice Acapella
                </>
              )}
            </Button>
          </div>
        )}
        <ScrollArea className="h-[40vh] pr-4">
          <div className="whitespace-pre-wrap font-body text-base md:text-lg leading-relaxed text-foreground/90">
            {formatLyrics(lyrics)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
