
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
import type { Quote } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const quoteFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  emoji: z.string().min(1, "Emoji is required."),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export default function TherapistQuotesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: { title: '', description: '', emoji: '' },
  });

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user) {
          setLoading(false);
          return;
      };
      setLoading(true);
      try {
        const q = query(
          collection(db, 'quotes'), 
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userQuotes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate(),
        } as Quote));
        setQuotes(userQuotes);
      } catch (error) {
        console.error("Error fetching quotes:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your quotes.' });
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, [user, toast]);
  
  const handleFormSubmit = async (values: QuoteFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
        if(editingQuote) {
            // Update existing quote
            const quoteRef = doc(db, "quotes", editingQuote.id);
            await updateDoc(quoteRef, values);
            setQuotes(prev => prev.map(q => q.id === editingQuote.id ? {...q, ...values} : q));
            toast({ title: 'Success', description: 'Quote updated successfully.' });
        } else {
            // Add new quote
            const newQuoteData = {
                ...values,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                createdAt: serverTimestamp(),
            };
            const docRef = await addDoc(collection(db, 'quotes'), newQuoteData);
            // We need to re-fetch or optimistically update. Optimistic is better for UX.
             const addedQuote: Quote = {
                id: docRef.id,
                ...values,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                createdAt: new Date() as any, // This is an approximation
            };
            setQuotes(prev => [addedQuote, ...prev]);
            toast({ title: 'Success', description: 'Quote added successfully.' });
        }

        form.reset();
        setIsDialogOpen(false);
        setEditingQuote(null);
    } catch (error) {
        console.error("Error submitting quote:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save the quote.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (quoteId: string) => {
    try {
      await deleteDoc(doc(db, "quotes", quoteId));
      setQuotes(prev => prev.filter(q => q.id !== quoteId));
      toast({ title: 'Success', description: 'Quote deleted.' });
    } catch(error) {
      console.error("Error deleting quote:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete the quote.' });
    }
  }
  
  const openEditDialog = (quote: Quote) => {
    setEditingQuote(quote);
    form.reset({
      title: quote.title,
      description: quote.description,
      emoji: quote.emoji,
    });
    setIsDialogOpen(true);
  }

  const openNewDialog = () => {
    setEditingQuote(null);
    form.reset({ title: '', description: '', emoji: '' });
    setIsDialogOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">Your Motivational Quotes</h1>
            <p className="text-muted-foreground">Share inspiration with the community.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={openNewDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Quote
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">{editingQuote ? 'Edit' : 'Add a new'} Quote</DialogTitle>
                    <DialogDescription>
                        This quote will be visible to clients on their dashboard for inspiration.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input placeholder="e.g., The Power of Yet" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="Share your wisdom..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="emoji" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emoji</FormLabel>
                                <FormControl><Input placeholder="🌱" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingQuote ? 'Save Changes' : 'Add Quote'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
             Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
            ))
        ) : quotes.length > 0 ? (
          quotes.map((quote) => (
            <Card key={quote.id} className="flex flex-col">
              <CardHeader className="flex-row items-start gap-4">
                <span className="text-4xl mt-1">{quote.emoji}</span>
                <div>
                    <CardTitle className="font-headline">{quote.title}</CardTitle>
                    <CardDescription>{quote.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="flex justify-between items-center bg-muted/50 p-3">
                 <p className="text-xs text-muted-foreground">
                    {new Date(quote.createdAt as any).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(quote)}>
                        <Edit className="h-4 w-4"/>
                    </Button>
                     <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(quote.id)}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">You haven't shared any quotes yet.</p>
        )}
      </div>

    </div>
  );
}
