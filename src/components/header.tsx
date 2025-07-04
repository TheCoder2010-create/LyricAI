"use client";

import { Music } from 'lucide-react';
import SplitText from '@/components/split-text';

export function Header() {
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
      </div>
    </header>
  );
}
