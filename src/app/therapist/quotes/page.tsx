
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Loader2, Edit, Trash2, QuoteIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

type Quote = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
};

const quoteEmojis = [
    { value: '😊', label: 'Happy' },
    { value: '⭐', label: 'Inspiring' },
    { value: '❤️', label: 'Love' },
    { value: '💡', label: 'Insightful' },
    { value: '🌱', label: 'Growth' },
    { value: '🧘', label: 'Calm' },
];

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    emoji: z.string({ required_error: "Please select an emoji for the quote." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function TherapistQuotesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

     useEffect(() => {
        if (user) {
            fetchQuotes();
        }
    }, [user]);

    useEffect(() => {
        if (editingQuote) {
            form.reset({
                title: editingQuote.title,
                description: editingQuote.description,
                emoji: editingQuote.emoji,
            });
        } else {
            form.reset({ title: "", description: "", emoji: "" });
        }
    }, [editingQuote, form]);

    const fetchQuotes = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, "quotes"),
                where("authorId", "==", user.uid),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const quotesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
            setQuotes(quotesList);
        } catch (error) {
            console.error("Error fetching quotes:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not fetch your quotes." });
        } finally {
            setLoading(false);
        }
    };
    
    const handleFormSubmit = async (values: FormValues) => {
        if (!user) return;
        setIsSubmitting(true);
        
        try {
            if (editingQuote) {
                // Update existing quote
                const quoteRef = doc(db, "quotes", editingQuote.id);
                await updateDoc(quoteRef, values);
                toast({ title: "Quote Updated", description: "Your quote has been successfully updated." });
                setQuotes(quotes.map(q => q.id === editingQuote.id ? { ...q, ...values } as Quote : q));
            } else {
                // Create new quote
                const newQuoteData = {
                    ...values,
                    authorId: user.uid,
                    authorName: user.displayName || "Anonymous Therapist",
                    createdAt: serverTimestamp(),
                };
                const docRef = await addDoc(collection(db, "quotes"), newQuoteData);
                // Note: 'createdAt' will be a server timestamp object. For instant UI update, we use a client-side date.
                // a full solution would re-fetch or use the onSnapshot listener.
                setQuotes([{ id: docRef.id, ...newQuoteData, createdAt: new Timestamp(Date.now()/1000, 0) } as Quote, ...quotes]);
                toast({ title: "Quote Shared", description: "Your motivational quote has been shared." });
            }
            setIsDialogOpen(false);
            setEditingQuote(null);
        } catch (error) {
            console.error("Error submitting quote:", error);
            toast({ variant: "destructive", title: "Error", description: "There was a problem saving your quote." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteQuote = async (quoteId: string) => {
        try {
            await deleteDoc(doc(db, "quotes", quoteId));
            setQuotes(quotes.filter(q => q.id !== quoteId));
            toast({ title: "Quote Deleted", description: "The quote has been successfully removed." });
        } catch (error) {
             console.error("Error deleting quote:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not delete the quote." });
        }
    }


    const openDialogForEdit = (quote: Quote) => {
        setEditingQuote(quote);
        setIsDialogOpen(true);
    }
    
    const openDialogForCreate = () => {
        setEditingQuote(null);
        setIsDialogOpen(true);
    }
    

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Manage Your Quotes</h1>
                    <p className="text-muted-foreground">Create, edit, and delete your motivational quotes.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openDialogForCreate}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Quote
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-headline">{editingQuote ? 'Edit Quote' : 'Add a New Quote'}</DialogTitle>
                            <DialogDescription>{editingQuote ? 'Update the details of your quote.' : 'Share some new inspiration with the community.'}</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl><Input placeholder="e.g., Embrace the Journey" {...field} /></FormControl>
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
                                            <FormControl><Textarea placeholder="e.g., Every step is progress..." {...field} /></FormControl>
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
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-2 pt-2">
                                                {quoteEmojis.map((emoji) => (
                                                <FormItem key={emoji.value} className="flex items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={emoji.value} id={`quote-emoji-${emoji.label}`} className="sr-only peer" />
                                                    </FormControl>
                                                    <FormLabel htmlFor={`quote-emoji-${emoji.label}`} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
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
                                <DialogFooter>
                                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingQuote ? 'Save Changes' : 'Share Quote'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({length: 3}).map((_, i) => (
                        <Card key={i}><CardHeader><Skeleton className="h-24 w-full" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent><CardFooter><Skeleton className="h-10 w-full" /></CardFooter></Card>
                    ))}
                </div>
            ) : quotes.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quotes.map(quote => (
                        <Card key={quote.id} className="flex flex-col">
                            <CardHeader className="flex-row items-start gap-4 space-y-0">
                                <div className="text-5xl">{quote.emoji}</div>
                                <div className="flex-1">
                                    <CardTitle className="font-headline">{quote.title}</CardTitle>
                                    <CardDescription className="line-clamp-3">{quote.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1" />
                            <CardFooter className="flex justify-end gap-2 bg-muted/50 p-3">
                                 <Button variant="outline" size="sm" onClick={() => openDialogForEdit(quote)}>
                                    <Edit className="mr-2 h-4 w-4"/> Edit
                                 </Button>
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                         <Button variant="destructive" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                                         </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This will permanently delete this quote. This action cannot be undone.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteQuote(quote.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                 </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                 <Card className="md:col-span-3 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <QuoteIcon className="h-12 w-12 mb-4" />
                    <p>You haven't shared any quotes yet.</p>
                    <p className="text-sm">Click "Add New Quote" to share some inspiration.</p>
                </Card>
            )}
        </div>
    );
}
