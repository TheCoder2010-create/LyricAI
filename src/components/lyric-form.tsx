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
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  genre: z.string().min(2, {
    message: "Genre must be at least 2 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface LyricFormProps {
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
}

export function LyricForm({ onSubmit, isLoading }: LyricFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            genre: "",
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
                            <FormLabel>Topic</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Summer romance" {...field} />
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
                            <FormLabel>Genre</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Pop, Rock, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Generating..." : "Generate Lyrics"}
                </Button>
            </form>
        </Form>
    );
}
