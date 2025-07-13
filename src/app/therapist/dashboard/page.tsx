
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Smile, Star, Heart, Lightbulb } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { FirebaseError } from "firebase/app";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type User = {
    id: string;
    name: string;
    role: 'client' | 'therapist';
    isOnline: boolean;
    imageUrl?: string;
}

const quoteEmojis = [
    { value: '😊', label: 'Happy', icon: Smile },
    { value: '⭐', label: 'Inspiring', icon: Star },
    { value: '❤️', label: 'Love', icon: Heart },
    { value: '💡', label: 'Insightful', icon: Lightbulb },
];

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    emoji: z.string({ required_error: "Please select an emoji for the quote." }),
});

type FormValues = z.infer<typeof formSchema>;


export default function TherapistDashboard() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    useEffect(() => {
        const fetchActiveUsers = async () => {
            setLoading(true);
            try {
                const usersQuery = query(
                    collection(db, "users"),
                    where("isOnline", "==", true)
                );
                const querySnapshot = await getDocs(usersQuery);
                const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                
                const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
                
                setActiveUsers(sortedUsers);
            } catch (error) {
                console.error("Error fetching active users: ", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch active users."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchActiveUsers();
    }, [toast]);


    const handleQuoteSubmit = async (values: FormValues) => {
        if (!user) {
            toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to post." });
            return;
        }

        try {
            await addDoc(collection(db, "quotes"), {
                title: values.title,
                description: values.description,
                emoji: values.emoji,
                authorId: user.uid,
                authorName: user.displayName || "Anonymous Therapist",
                createdAt: serverTimestamp(),
            });

            toast({
                title: "Quote Shared",
                description: "Your motivational quote has been shared with the community.",
            });
            
            form.reset();

        } catch (error: any) {
            console.error("Error sharing quote: ", error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: `There was an error sharing your quote: ${error.message}`,
            });
        }
    };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Therapist Dashboard</h1>
        <p className="text-muted-foreground">Manage your content and see who's active.</p>
      </div>

       <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Share a Motivational Quote</CardTitle>
                        <CardDescription>Share some inspiration with the community.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleQuoteSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Embrace the Journey" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., Every step is progress..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="emoji"
                                render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Choose an Emoji</FormLabel>
                                    <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-wrap gap-2 pt-2"
                                    >
                                        {quoteEmojis.map((emoji) => (
                                        <FormItem key={emoji.value} className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value={emoji.value} id={`quote-emoji-${emoji.label}`} className="sr-only peer" />
                                            </FormControl>
                                            <FormLabel
                                                htmlFor={`quote-emoji-${emoji.label}`}
                                                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                            >
                                                <span className="text-3xl">{emoji.value}</span>
                                            </FormLabel>
                                        </FormItem>
                                        ))}
                                    </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" /> }
                                Share Quote
                            </Button>
                        </form>
                      </Form>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Active Users</CardTitle>
                        <CardDescription>Users currently online.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                            ))
                        ) : (
                            activeUsers.length > 0 ? activeUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.imageUrl || 'https://placehold.co/100x100.png'} alt={user.name} />
                                            <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                    </div>
                                    {user.role === 'therapist' ? <Badge variant="outline">Therapist</Badge> : <Badge variant="secondary">Client</Badge>}
                                </div>
                            )) : <p className="text-sm text-muted-foreground text-center py-4">No users are currently online.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
       </div>

    </div>
  );
}
