"use client";

import { Music, Sparkles } from 'lucide-react';
import SplitText from '@/components/split-text';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  isPro: boolean;
  onUpgradeClick: () => void;
}

export function Header({ isPro, onUpgradeClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-4xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Music className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-foreground">
              <SplitText
                  text="Lyric"
                  from={{ opacity: 0, y: 20 }}
                  to={{ opacity: 1, y: 0 }}
                  delay={50}
                  duration={0.5}
                  textAlign="left"
              />
              <SplitText
                  text="AI"
                  className="text-primary"
                  from={{ opacity: 0, y: 20 }}
                  to={{ opacity: 1, y: 0 }}
                  delay={50}
                  duration={0.5}
                  textAlign="left"
              />
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {isPro ? (
            <Badge variant="default" className="border-yellow-400/50 bg-yellow-400/10 text-yellow-300">
              <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
              Pro Plan
            </Badge>
          ) : (
            <Button onClick={onUpgradeClick}>
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
