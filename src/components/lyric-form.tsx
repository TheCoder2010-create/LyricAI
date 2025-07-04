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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }).max(200, {
    message: "Topic must not be longer than 200 characters.",
  }),
  genre: z.string({
    required_error: "Please select a genre.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface LyricFormProps {
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
}

const genres = [
    "Pop", "Rock", "Hip-Hop", "R&B", "Country", "Electronic", "Jazz", "Blues", "Folk", "Indie"
];

export function LyricForm({ onSubmit, isLoading }: LyricFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
        },
    });

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
                            <FormLabel>Music Genre</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
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
