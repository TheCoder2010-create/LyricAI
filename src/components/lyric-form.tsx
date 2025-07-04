"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";

const formSchema = z.object({
  topic: z.string().max(200).optional(),
  genre: z.string().optional(),
  spotifyUrl: z.string().url({ message: "Please enter a valid Spotify URL." }).optional().or(z.literal('')),
  generateStructure: z.boolean().optional(),
}).refine(data => data.topic || data.spotifyUrl, {
  message: "Please provide either a topic or a Spotify URL.",
  path: ["topic"],
});


type FormData = z.infer<typeof formSchema>;

interface LyricFormProps {
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
    onProFeatureClick: () => void;
}

const genres = [
    "Pop", "Rock", "Hip-Hop", "R&B", "Country", "Electronic", "Jazz", "Blues", "Folk", "Indie"
];

export function LyricForm({ onSubmit, isLoading, onProFeatureClick }: LyricFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            spotifyUrl: "",
            generateStructure: false,
        },
    });

    const watchSpotifyUrl = form.watch("spotifyUrl");
    const watchTopic = form.watch("topic");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>What should the song be about?</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="e.g., A road trip with friends, a lost love, finding a stray cat..." 
                                    className="resize-none"
                                    {...field}
                                    disabled={!!watchSpotifyUrl} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Music Genre <span className="text-muted-foreground/80">(Optional if using Spotify URL)</span></FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!watchSpotifyUrl}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a genre" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {genres.map(genre => (
                                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center space-x-4">
                    <Separator className="flex-1" />
                    <span className="text-xs font-medium text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                </div>

                <FormField
                    control={form.control}
                    name="spotifyUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Get inspiration from a song</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Paste a Spotify song URL..."
                                    {...field}
                                    disabled={!!watchTopic}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Separator />
                
                <FormField
                    control={form.control}
                    name="generateStructure"
                    render={({ field }) => (
                        <FormItem 
                            className="flex flex-row items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={onProFeatureClick}
                        >
                            <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center gap-2">
                                    Generate Full Song Structure
                                    <Badge variant="destructive" className="bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-90 duration-500">PRO</Badge>
                                </FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled
                                    aria-readonly
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Crafting your song...
                        </>
                    ) : (
                        <>
                            <Wand2 className="mr-2 h-5 w-5" />
                            Generate Lyrics
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
}
