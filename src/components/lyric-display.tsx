"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2, Mic, Lightbulb, Lock, Sparkles } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { WaveformAudioPlayer } from "./waveform-audio-player";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface LyricDisplayProps {
  lyrics: string;
  analysis?: string;
  audioDataUri?: string;
  onGenerateAcapella: (lyrics: string) => void;
  isGeneratingAcapella: boolean;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  isPro: boolean;
  onUpgradeClick: () => void;
}

const voices = [
    { value: 'Algenib', label: 'Narrator (Male)' },
    { value: 'Achernar', label: 'Promoter (Female)' },
    { value: 'Sirius', label: 'Friendly (Male)' },
    { value: 'Vega', label: 'Calm (Female)' },
    { value: 'Canopus', label: 'Storyteller (Male)' },
];

export function LyricDisplay({
  lyrics,
  analysis,
  audioDataUri,
  onGenerateAcapella,
  isGeneratingAcapella,
  selectedVoice,
  onVoiceChange,
  isPro,
  onUpgradeClick,
}: LyricDisplayProps) {
  const [hasCopied, setHasCopied] = useState(false);

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
        <div className="mb-4 space-y-6">
            {audioDataUri ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Acapella
                </h4>
                <WaveformAudioPlayer url={audioDataUri} />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Vocal Style</h4>
                  <Select value={selectedVoice} onValueChange={onVoiceChange} disabled={isGeneratingAcapella}>
                      <SelectTrigger>
                          <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                          {voices.map((voice) => (
                              <SelectItem key={voice.value} value={voice.value}>{voice.label}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
                <div className="flex-shrink-0 sm:self-end">
                  <Button
                    onClick={() => onGenerateAcapella(lyrics)}
                    disabled={isGeneratingAcapella}
                    className="w-full"
                  >
                    {isGeneratingAcapella ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-5 w-5" />
                        Generate Acapella
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
        </div>

        <Separator className="my-6"/>

        {analysis && (
          <div className="mb-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                    AI Songwriting Coach
                    {!isPro && <Lock className="h-4 w-4 text-muted-foreground"/>}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {isPro ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysis}</p>
                  ) : (
                    <div className="text-center p-4 rounded-md bg-muted/30">
                      <p className="text-muted-foreground mb-4">Upgrade to Pro to unlock your personal AI songwriting analysis.</p>
                      <Button onClick={onUpgradeClick} size="sm">
                        <Sparkles className="mr-2 h-4 w-4"/>
                        Upgrade Now
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
