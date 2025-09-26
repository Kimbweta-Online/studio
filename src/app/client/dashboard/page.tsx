
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { quotes as staticQuotes } from '@/lib/data';
import { ArrowRight, Bot } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { LosadaRatioWidget } from '@/components/losada-ratio-widget';

// A type for the local quote data
type StaticQuote = {
    title: string;
    description: string;
    emoji: string;
};


export default function ClientDashboard() {
  const [quotes, setQuotes] = useState<StaticQuote[]>([]);

  useEffect(() => {
    // Use the static quotes from the data file.
    // We shuffle them to show a different set on each page load.
    const shuffledQuotes = [...staticQuotes].sort(() => 0.5 - Math.random());
    setQuotes(shuffledQuotes.slice(0, 2));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Client Dashboard</h1>
        <p className="text-muted-foreground">Your space for growth and support.</p>
      </div>

       <LosadaRatioWidget />

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
                Chat with AI Assistant
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Daily Inspiration</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
           {quotes.map((quote, index) => (
              <Card key={index} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full bg-accent/50 flex items-center justify-center">
                  <span className="text-7xl">{quote.emoji}</span>
                </div>
                <CardHeader>
                  <CardTitle className="font-headline">{quote.title}</CardTitle>
                  <CardDescription>{quote.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <p className="text-sm text-muted-foreground">Shared by the Mindset Theater Team</p>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
