"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface LyricDisplayProps {
    lyrics: string;
}

export function LyricDisplay({ lyrics }: LyricDisplayProps) {
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
        return text.split('\n').map((line, index) => {
            const isSectionHeader = line.trim().startsWith('[') && line.trim().endsWith(']');
            if (isSectionHeader) {
                return (
                    <h3 key={index} className="font-headline text-xl font-semibold mt-6 mb-2 text-primary">
                        {line.trim()}
                    </h3>
                );
            }
            if (line.trim() === '') {
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
        <Card className="w-full animate-in fade-in-0 duration-1000">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-2xl">Your Masterpiece</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy lyrics">
                    {hasCopied ? (
                        <Check className="h-5 w-5 text-green-500" />
                    ) : (
                        <Copy className="h-5 w-5" />
                    )}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="whitespace-pre-wrap font-body text-base md:text-lg leading-relaxed text-foreground/90">
                    {formatLyrics(lyrics)}
                </div>
            </CardContent>
        </Card>
    );
}
