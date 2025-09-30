
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import type { Quote } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';


export default function ClientDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoadingQuotes(true);
      try {
        const q = query(
          collection(db, 'quotes'),
          orderBy('createdAt', 'desc'),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const fetchedQuotes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
        setQuotes(fetchedQuotes);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoadingQuotes(false);
      }
    };
    fetchQuotes();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Client Dashboard</h1>
        <p className="text-muted-foreground">Your space for growth and support.</p>
      </div>

      <Card className="bg-primary/10 border-primary/20 shadow-lg">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
             <Player
                src="https://lottie.host/4a53dd9e-8e84-4732-a25e-4613e51855a8/4FkF2e463M.json"
                background="transparent"
                speed={1}
                style={{ width: '150px', height: '150px' }}
                loop
                autoplay
              />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold font-headline mb-2">Feeling Overwhelmed?</h2>
            <p className="text-muted-foreground mb-4">
              Our AI assistant is here to listen and provide support anytime you need it. Share your thoughts and get instant, helpful feedback.
            </p>
            <Button asChild>
              <Link href="/client/ai-chat">
                <Bot className="mr-2 h-4 w-4" />
                Chat with Dr. Mindset
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Daily Inspiration</h2>
        <div className="grid gap-6 md:grid-cols-2">
           {loadingQuotes ? (
             Array.from({ length: 2 }).map((_, index) => (
                <Card key={index}>
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardFooter>
                        <Skeleton className="h-4 w-1/2" />
                    </CardFooter>
                </Card>
             ))
           ) : quotes.length > 0 ? (
              quotes.map((quote) => (
              <Card key={quote.id} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full bg-accent/50 flex items-center justify-center">
                  <span className="text-7xl">{quote.emoji}</span>
                </div>
                <CardHeader>
                  <CardTitle className="font-headline">{quote.title}</CardTitle>
                  <CardDescription>{quote.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <p className="text-sm text-muted-foreground">Shared by {quote.authorName}</p>
                </CardFooter>
              </Card>
            ))
           ) : (
             <p className="text-muted-foreground text-center col-span-2">No inspiration shared yet. Check back later!</p>
           )}
        </div>
      </div>
    </div>
  );
}
