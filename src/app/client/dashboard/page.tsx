
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Info, Quote as QuoteIcon } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { ChatMessage, Quote } from '@/lib/data';
import { analyzeSentiment } from '@/ai/flows/analyze-sentiment';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


const positiveQuotes = [
    "Keep shining! Your positivity is a beacon.",
    "You're on the right track. Your positive mindset is creating a wonderful reality.",
    "Flourishing looks good on you! Keep up the great work.",
    "Your positive energy is contagious. Keep spreading the light!",
];

const encouragingQuotes = [
    "Every day is a new beginning. Take a deep breath and start again.",
    "A small positive thought in the morning can change your whole day.",
    "You are stronger than you think. Keep focusing on the good.",
    "The journey of a thousand miles begins with a single step. You've got this.",
];


export default function ClientDashboard() {
  const { user } = useAuth();
  const [losadaData, setLosadaData] = useState<{ ratio: number; positive: number; negative: number; neutral: number } | null>(null);
  const [loadingRatio, setLoadingRatio] = useState(true);
  const [quote, setQuote] = useState<string>("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);


  useEffect(() => {
    const calculateLosadaRatio = async () => {
      if (!user) return;
      setLoadingRatio(true);

      try {
        const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
        const chatsSnapshot = await getDocs(chatsQuery);

        const clientMessages: string[] = [];

        for (const chatDoc of chatsSnapshot.docs) {
          const messagesQuery = query(collection(chatDoc.ref, 'messages'), where('senderId', '==', user.uid));
          const messagesSnapshot = await getDocs(messagesQuery);
          messagesSnapshot.forEach(msgDoc => {
            const msgData = msgDoc.data() as ChatMessage;
            if (msgData.text && msgData.text.trim() !== "This message has been deleted.") {
              clientMessages.push(msgData.text);
            }
          });
        }
        
        if (clientMessages.length < 5) {
            setLosadaData({ ratio: 0, positive: 0, negative: 0, neutral: 0 });
            setQuote("Start a conversation with a therapist to see your positivity ratio.");
            return;
        }

        const sentimentPromises = clientMessages.map(text => analyzeSentiment({ text }));
        const sentiments = await Promise.all(sentimentPromises);

        const counts = sentiments.reduce((acc, result) => {
          acc[result.sentiment] = (acc[result.sentiment] || 0) + 1;
          return acc;
        }, { positive: 0, negative: 0, neutral: 0 });

        const ratio = counts.negative > 0 ? counts.positive / counts.negative : counts.positive;

        setLosadaData({
          ratio,
          positive: counts.positive,
          negative: counts.negative,
          neutral: counts.neutral,
        });

        if (ratio >= 3) {
            setQuote(positiveQuotes[Math.floor(Math.random() * positiveQuotes.length)]);
        } else {
            setQuote(encouragingQuotes[Math.floor(Math.random() * encouragingQuotes.length)]);
        }

      } catch (error) {
        console.error("Error calculating Losada ratio:", error);
      } finally {
        setLoadingRatio(false);
      }
    };
    
     const fetchQuotes = async () => {
      setLoadingQuotes(true);
      try {
        const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const quotesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
        setQuotes(quotesList);
      } catch (error) {
        console.error("Error fetching quotes: ", error);
      } finally {
        setLoadingQuotes(false);
      }
    };

    calculateLosadaRatio();
    fetchQuotes();
  }, [user]);
    
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Client Dashboard</h1>
        <p className="text-muted-foreground">Your space for growth and support.</p>
      </div>
      
       <Card>
          <CardHeader>
              <CardTitle className="font-headline">Daily Inspiration</CardTitle>
              <CardDescription>A dose of motivation for your day.</CardDescription>
          </CardHeader>
          <CardContent>
              {loadingQuotes ? (
                  <Skeleton className="h-24 w-full" />
              ) : quotes.length > 0 ? (
                  <Carousel
                    plugins={[Autoplay({ delay: 5000 })]}
                    className="w-full"
                    opts={{ loop: true }}
                   >
                    <CarouselContent>
                        {quotes.map((q) => (
                            <CarouselItem key={q.id}>
                                <div className="p-1 text-center">
                                    <blockquote className="text-lg font-semibold italic">"{q.text}"</blockquote>
                                    <p className="text-sm text-muted-foreground mt-2">- {q.authorName}</p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
                 </Carousel>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                    <QuoteIcon className="mx-auto h-8 w-8 mb-2" />
                    <p>No inspirational quotes available at the moment.</p>
                </div>
              )}
          </CardContent>
       </Card>

       <div className="grid lg:grid-cols-2 gap-8">
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
          <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center justify-between">
                    <span>Positivity Ratio</span>
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>The Losada Ratio measures the balance of your positive to negative language in chats. A ratio of 3:1 or higher is often linked to flourishing mental well-being.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                </CardTitle>
                <CardDescription>An analysis of your recent conversations with therapists.</CardDescription>
            </CardHeader>
            <CardContent>
                {loadingRatio ? (
                   <div className="space-y-4 pt-4">
                        <Skeleton className="h-8 w-1/3 mx-auto" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                   </div>
                ) : losadaData ? (
                  losadaData.positive + losadaData.negative + losadaData.neutral < 5 ? (
                     <div className="text-center text-muted-foreground py-6">
                        <p>Not enough chat data to calculate a ratio. Start a conversation with a therapist!</p>
                     </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-4xl font-bold text-primary">{losadaData.ratio.toFixed(1)} : 1</div>
                         <div className="w-full space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Positive</span>
                                <span className="text-muted-foreground">{losadaData.positive}</span>
                            </div>
                            <Progress value={(losadaData.positive / (losadaData.positive + losadaData.negative + losadaData.neutral)) * 100} className="h-2 [&>div]:bg-green-500" />
                            
                             <div className="flex justify-between">
                                <span className="font-medium">Negative</span>
                                <span className="text-muted-foreground">{losadaData.negative}</span>
                            </div>
                            <Progress value={(losadaData.negative / (losadaData.positive + losadaData.negative + losadaData.neutral)) * 100} className="h-2" variant="destructive" />

                             <div className="flex justify-between">
                                <span className="font-medium">Neutral</span>
                                <span className="text-muted-foreground">{losadaData.neutral}</span>
                            </div>
                            <Progress value={(losadaData.neutral / (losadaData.positive + losadaData.negative + losadaData.neutral)) * 100} className="h-2" />
                        </div>
                        <p className="text-xs text-muted-foreground text-center italic mt-2">
                           "{quote}"
                        </p>
                    </div>
                  )
                ) : (
                    <div className="text-center text-muted-foreground py-6">
                        <p>Could not calculate positivity ratio at this time.</p>
                     </div>
                )}
            </CardContent>
          </Card>
       </div>
    </div>
  );
}
