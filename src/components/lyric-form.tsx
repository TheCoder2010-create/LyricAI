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
import { Loader2, Wand2, Lock, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const formSchema = z.object({
  topic: z.string().max(200).optional(),
  genre: z.string().optional(),
  language: z.string().optional(),
  inspiredBy: z.string().optional(),
  spotifyUrl: z.string().url({ message: "Please enter a valid Spotify URL." }).optional().or(z.literal('')),
}).refine(data => data.topic || data.spotifyUrl, {
  message: "Please provide either a topic or a Spotify URL.",
  path: ["topic"],
});


type FormData = z.infer<typeof formSchema>;

interface LyricFormProps {
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
    isPro: boolean;
    onUpgradeClick: () => void;
}

const genres = [
    "Pop", "Rock", "Hip-Hop", "R&B", "Country", "Electronic", "Jazz", "Blues", "Folk", "Indie", "Bollywood"
];

const languages = [
    "English", "Spanish", "French", "German", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Odia", "Assamese", "Urdu"
];

const singers = [
    { value: "Kishore Kumar (Energetic, Yodeling)", label: "Kishore Kumar (Energetic, Yodeling)" },
    { value: "Lata Mangeshkar (Melodious, Classical)", label: "Lata Mangeshkar (Melodious, Classical)" },
    { value: "Asha Bhosle (Versatile, Peppy)", label: "Asha Bhosle (Versatile, Peppy)" },
    { value: "Mohammed Rafi (Romantic, Soulful)", label: "Mohammed Rafi (Romantic, Soulful)" },
    { value: "R.D. Burman (Experimental, Groovy)", label: "R.D. Burman (Experimental, Groovy)" },
    { value: "Udit Narayan (Melodic, 90s Pop)", label: "Udit Narayan (Melodic, 90s Pop)" },
    { value: "Alka Yagnik (Sweet, Romantic)", label: "Alka Yagnik (Sweet, Romantic)" },
    { value: "Kumar Sanu (Nasal, 90s Romance)", label: "Kumar Sanu (Nasal, 90s Romance)" },
    { value: "A.R. Rahman (Fusion, Innovative)", label: "A.R. Rahman (Fusion, Innovative)" },
    { value: "Sonu Nigam (Versatile, Modern)", label: "Sonu Nigam (Versatile, Modern)" },
    { value: "Shreya Ghoshal (Classical, Melodious)", label: "Shreya Ghoshal (Classical, Melodious)" },
    { value: "Sunidhi Chauhan (Powerful, Energetic)", label: "Sunidhi Chauhan (Powerful, Energetic)" },
    { value: "Arijit Singh (Soulful, Romantic)", label: "Arijit Singh (Soulful, Romantic)" },
    { value: "Javed Akhtar (Poetic, Meaningful)", label: "Javed Akhtar (Poetic, Meaningful)" },
    { value: "Gulzar (Metaphorical, Lyrical)", label: "Gulzar (Metaphorical, Lyrical)" },
    { value: "Lucky Ali (Indie-Pop, Soulful)", label: "Lucky Ali (Indie-Pop, Soulful)" },
];


export function LyricForm({ onSubmit, isLoading, isPro, onUpgradeClick }: LyricFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            spotifyUrl: "",
            language: "English",
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

                <FormField
                    control={form.control}
                    name="inspiredBy"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Inspired By <span className="text-muted-foreground/80">(Optional)</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!watchSpotifyUrl}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a singer's style" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {singers.map(singer => (
                                        <SelectItem key={singer.value} value={singer.value}>{singer.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Language</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!watchSpotifyUrl}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {languages.map(lang => (
                                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
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
                            <FormLabel className="flex items-center gap-2">
                                Get inspiration from a song
                                {!isPro && <Badge variant="destructive" className="bg-yellow-400/20 text-yellow-300 border-none">Pro</Badge>}
                            </FormLabel>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="relative">
                                            <FormControl>
                                                <Input 
                                                    placeholder="Paste a Spotify song URL..."
                                                    {...field}
                                                    disabled={!!watchTopic || !isPro}
                                                    className={!isPro ? "cursor-not-allowed" : ""}
                                                />
                                            </FormControl>
                                            {!isPro && (
                                                <div onClick={onUpgradeClick} className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md cursor-pointer">
                                                    <div className="flex items-center gap-2 font-semibold text-foreground">
                                                        <Lock className="h-4 w-4"/>
                                                        <span>Upgrade to Pro to use Spotify links</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    {!!watchTopic && (
                                    <TooltipContent>
                                        <p>Clear the topic field to use a Spotify URL.</p>
                                    </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                            <FormMessage />
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
