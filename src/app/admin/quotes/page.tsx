
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import type { Quote } from "@/lib/data";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Loader2, Quote as QuoteIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminQuotesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const quotesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
        setQuotes(quotesList);
      } catch (error) {
        console.error("Error fetching quotes: ", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch quotes." });
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, [toast]);

  const handleOpenDialog = (quote: Quote | null = null) => {
    setCurrentQuote(quote);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const form = event.currentTarget;
    const text = (form.elements.namedItem("text") as HTMLTextAreaElement).value;

    try {
      if (currentQuote) {
        // Update existing quote
        const quoteRef = doc(db, "quotes", currentQuote.id);
        await updateDoc(quoteRef, { text });
        setQuotes(quotes.map(q => q.id === currentQuote.id ? { ...q, text } : q));
        toast({ title: "Quote Updated" });
      } else {
        // Add new quote
        const newQuote = {
          text,
          authorName: user.displayName || "Admin",
          authorId: user.uid,
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "quotes"), newQuote);
        setQuotes([{ id: docRef.id, ...newQuote } as Quote, ...quotes]);
        toast({ title: "Quote Added" });
      }
      setIsDialogOpen(false);
      setCurrentQuote(null);
    } catch (error) {
      console.error("Error saving quote: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not save the quote." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!quoteToDelete) return;
    try {
      await deleteDoc(doc(db, "quotes", quoteToDelete.id));
      setQuotes(quotes.filter(q => q.id !== quoteToDelete.id));
      toast({ title: "Quote Deleted" });
    } catch (error) {
      console.error("Error deleting quote: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete the quote." });
    } finally {
      setQuoteToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">Manage Quotes</h1>
            <p className="text-muted-foreground">Create, edit, and delete motivational quotes for clients.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Quote
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4 flex justify-between items-center"><Skeleton className="h-10 w-4/5" /><div className="flex gap-2"><Skeleton className="h-9 w-9" /><Skeleton className="h-9 w-9" /></div></Card>
              ))
            ) : quotes.length > 0 ? (
              quotes.map(quote => (
                <Card key={quote.id} className="p-4 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <blockquote className="italic text-lg">"{quote.text}"</blockquote>
                    <p className="text-sm text-muted-foreground mt-2">- {quote.authorName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(quote)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => setQuoteToDelete(quote)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
                 <div className="text-center py-12 text-muted-foreground">
                    <QuoteIcon className="mx-auto h-12 w-12 mb-4" />
                    <p>No quotes found.</p>
                    <p>Click "Add Quote" to create one.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentQuote ? "Edit" : "Add"} Quote</DialogTitle>
            <DialogDescription>
              {currentQuote ? "Make changes to this quote." : "Create a new motivational quote for clients."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="text">Quote Text</Label>
                <Textarea
                  id="text"
                  name="text"
                  rows={4}
                  defaultValue={currentQuote?.text || ""}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentQuote ? "Save Changes" : "Add Quote"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      {quoteToDelete && (
          <AlertDialog open={!!quoteToDelete} onOpenChange={() => setQuoteToDelete(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the quote.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      )}

    </div>
  );
}
