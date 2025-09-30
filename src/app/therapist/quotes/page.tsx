
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, Timestamp } from "firebase/firestore";
import type { Quote } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Edit, Trash2, Mic } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type QuoteFormInputs = {
  title: string;
  description: string;
  emoji: string;
};

export default function TherapistQuotesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const { register, handleSubmit, reset, setValue } = useForm<QuoteFormInputs>();

    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

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
            console.error("Error fetching quotes: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not fetch your quotes. The database may be missing an index."
            });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchQuotes();
    }, [user, toast]);

    const openEditDialog = (quote: Quote) => {
        setEditingQuote(quote);
        setValue("title", quote.title);
        setValue("description", quote.description);
        setValue("emoji", quote.emoji);
        setIsDialogOpen(true);
    };
    
    const openNewDialog = () => {
        setEditingQuote(null);
        reset({ title: "", description: "", emoji: "" });
        setIsDialogOpen(true);
    };

    const onSubmit: SubmitHandler<QuoteFormInputs> = async (data) => {
        if (!user) return;
        setIsSaving(true);
        
        try {
            if (editingQuote) {
                // Update existing quote
                const quoteRef = doc(db, "quotes", editingQuote.id);
                await updateDoc(quoteRef, { ...data });
                toast({ title: "Quote Updated", description: "Your motivational quote has been successfully updated." });
            } else {
                // Add new quote
                await addDoc(collection(db, "quotes"), {
                    ...data,
                    authorId: user.uid,
                    authorName: user.displayName || "Anonymous",
                    createdAt: serverTimestamp() as Timestamp,
                });
                toast({ title: "Quote Added", description: "Your new motivational quote has been shared." });
            }
            await fetchQuotes(); // Refresh the list
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving quote: ", error);
            toast({ variant: "destructive", title: "Save Failed", description: "There was an error saving your quote." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (quoteId: string) => {
        try {
            await deleteDoc(doc(db, "quotes", quoteId));
            setQuotes(quotes.filter(q => q.id !== quoteId));
            toast({ title: "Quote Deleted", variant: "destructive" });
        } catch (error) {
            console.error("Error deleting quote: ", error);
            toast({ variant: "destructive", title: "Delete Failed" });
        }
    };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Motivational Quotes</h1>
          <p className="text-muted-foreground">Share inspiration with the community.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={openNewDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Add Quote
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">{editingQuote ? "Edit Quote" : "Add a New Quote"}</DialogTitle>
                    <DialogDescription>Share a short, powerful message to inspire others.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="emoji" className="block text-sm font-medium text-muted-foreground mb-1">Emoji</label>
                        <Input id="emoji" placeholder="✨" maxLength={2} {...register("emoji", { required: true })} />
                    </div>
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                        <Input id="title" placeholder="e.g., Embrace the Journey" {...register("title", { required: true })} />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Quote</label>
                        <Textarea id="description" placeholder="The only impossible journey is the one you never begin." {...register("description", { required: true })} />
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingQuote ? "Save Changes" : "Share Quote"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        ) : quotes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map(quote => (
              <Card key={quote.id} className="flex flex-col">
                <CardHeader className="flex-row items-start gap-4">
                    <div className="text-4xl">{quote.emoji}</div>
                    <div className="flex-1">
                        <CardTitle>{quote.title}</CardTitle>
                        <CardDescription>
                            {quote.createdAt ? new Date(quote.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground italic">"{quote.description}"</p>
                </CardContent>
                <CardFooter className="bg-muted/50 p-3 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(quote)}>
                        <Edit className="h-4 w-4 mr-2"/> Edit
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2"/> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this quote.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(quote.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 px-6">
            <div className="flex justify-center mb-4">
              <Mic className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold font-headline">No Quotes Yet</h3>
            <p className="text-muted-foreground mt-2">
              You haven't shared any motivational quotes. <br />
              Click "Add Quote" to share your first piece of inspiration!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
