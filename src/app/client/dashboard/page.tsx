
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Mic } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import type { Quote } from '@/lib/data';
import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';


export default function ClientDashboard() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            setLoading(true);
            try {
                // Query to get the most recent quotes from all therapists
                const quotesQuery = query(
                    collection(db, "quotes"),
                    orderBy("createdAt", "desc"),
                    limit(10) 
                );
                const querySnapshot = await getDocs(quotesQuery);
                const quotesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
                setQuotes(quotesList);
            } catch (error) {
                console.error("Error fetching quotes:", error);
            } finally {
                setLoading(false);
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
        {loading ? (
             <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
            </div>
        ) : quotes.length > 0 ? (
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {quotes.map((quote) => (
                        <CarouselItem key={quote.id} className="md:basis-1/2">
                            <Card className="h-full flex flex-col">
                                <CardHeader className="flex-row items-start gap-4">
                                     <div className="text-4xl">{quote.emoji}</div>
                                     <div>
                                        <CardTitle>{quote.title}</CardTitle>
                                        <CardDescription>by {quote.authorName}</CardDescription>
                                     </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-muted-foreground italic">"{quote.description}"</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        ) : (
           <Card className="text-muted-foreground text-center col-span-2 py-10 flex flex-col items-center justify-center">
              <Mic className="h-12 w-12 mb-4" />
              <p>No inspiration shared yet.</p>
              <p className="text-sm">Therapists haven't posted any quotes. Check back later!</p>
           </Card>
        )}
      </div>
    </div>
  );
}
