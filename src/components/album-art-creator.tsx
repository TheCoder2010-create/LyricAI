'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Download, Loader2, Sparkles, Wand2, Lock } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AlbumArtCreatorProps {
  onGenerate: (imageDataUri: string) => void;
  isGenerating: boolean;
  result: {
    dataUri?: string;
    error?: string;
  };
  isPro: boolean;
  onUpgradeClick: () => void;
}

export function AlbumArtCreator({ onGenerate, isGenerating, result, isPro, onUpgradeClick }: AlbumArtCreatorProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        setUploadError('Image size cannot exceed 4MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setUploadError(null);
      };
      reader.onerror = () => {
        setUploadError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateClick = () => {
    if (uploadedImage) {
      onGenerate(uploadedImage);
    }
  };

  if (!isPro) {
    return (
      <Card className="w-full animate-in fade-in-0 slide-in-from-bottom-10 duration-700 ease-out shadow-2xl border border-primary/20 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Create Your Album Art
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg">
                <Lock className="h-12 w-12 text-primary/50 mb-4" />
                <h3 className="text-xl font-bold mb-2">This is a Pro Feature</h3>
                <p className="text-muted-foreground mb-6">Upgrade to LyricAI Pro to turn your images into unique album art.</p>
                <Button onClick={onUpgradeClick}>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Upgrade to Pro
                </Button>
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full animate-in fade-in-0 slide-in-from-bottom-10 duration-700 ease-out shadow-2xl border border-primary/20 bg-card/60 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Create Your Album Art
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Image Upload Area */}
            <div className="relative aspect-square w-full rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center p-4 text-center">
                {uploadedImage && !result.dataUri ? (
                    <Image src={uploadedImage} alt="Uploaded preview" layout="fill" objectFit="cover" className="rounded-md"/>
                ) : (
                    <>
                        <Camera className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <label htmlFor="image-upload" className="font-medium text-primary cursor-pointer hover:underline">
                            Upload your image
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                className="sr-only"
                                onChange={handleFileChange}
                                disabled={isGenerating || !!result.dataUri}
                            />
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or WEBP. Max 4MB.</p>
                    </>
                )}
            </div>

            {/* Generated Image Area */}
            <div className="relative aspect-square w-full rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                {isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-md">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-lg font-semibold">Creating your art...</p>
                    </div>
                )}
                {result.dataUri ? (
                     <Image src={result.dataUri} alt="Generated album art" layout="fill" objectFit="cover" className="rounded-md" />
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                         <Wand2 className="h-10 w-10 mx-auto mb-2 opacity-50"/>
                         Your generated album art will appear here.
                    </div>
                )}
            </div>
        </div>

        {uploadError && (
             <Alert variant="destructive">
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
        )}

        <div className="flex justify-end gap-4">
            {result.dataUri && (
                <a href={result.dataUri} download="album-art.png">
                    <Button variant="outline">
                        <Download className="mr-2 h-5 w-5" />
                        Download Art
                    </Button>
                </a>
            )}
            <Button onClick={handleGenerateClick} disabled={!uploadedImage || isGenerating || !!result.dataUri}>
                {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Album Art
                    </>
                )}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
