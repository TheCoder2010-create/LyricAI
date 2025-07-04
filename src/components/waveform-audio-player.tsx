"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WaveformAudioPlayerProps {
  url: string;
}

export function WaveformAudioPlayer({ url }: WaveformAudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { wavesurfer, isReady: wsIsReady, isPlaying: wsIsPlaying } = useWavesurfer({
    container: containerRef,
    url: url,
    waveColor: 'hsl(var(--muted-foreground) / 0.5)',
    progressColor: 'hsl(var(--primary))',
    cursorColor: 'hsl(var(--accent))',
    height: 64,
    barWidth: 3,
    barGap: 2,
    barRadius: 3,
    responsive: true,
  });

  useEffect(() => {
    setIsPlaying(wsIsPlaying);
  }, [wsIsPlaying]);

  useEffect(() => {
    if (wsIsReady) {
      setIsReady(true);
    }
  }, [wsIsReady]);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <div className="flex items-center gap-4 w-full">
      <Button
        onClick={onPlayPause}
        variant="outline"
        size="icon"
        className="rounded-full h-12 w-12 flex-shrink-0"
        disabled={!isReady}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 pl-0.5" />
        )}
      </Button>
      <div className="relative w-full">
        {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading audio...</span>
            </div>
        )}
        <div ref={containerRef} className={cn("w-full transition-opacity min-h-[64px]", !isReady && 'opacity-0')} />
      </div>
    </div>
  );
}
