
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, collectionGroup } from 'firebase/firestore';
import { analyzeChatSentiment } from '@/ai/flows/analyze-chat-sentiment';
import { generatePositivitySuggestions } from '@/ai/flows/generate-positivity-suggestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, Sparkles, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/data';

type AiChatMessage = {
    id: string;
    question: string;
    answer: string;
    timestamp: any;
}

export function LosadaRatioWidget() {
    const { user } = useAuth();
    const [ratio, setRatio] = useState<number | null>(null);
    const [sentimentCounts, setSentimentCounts] = useState<{ positive: number; negative: number; neutral: number } | null>(null);
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchAndAnalyzeChats = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch AI chat history
                const aiChatsQuery = query(collection(db, 'ai_chats'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
                const aiChatsSnapshot = await getDocs(aiChatsQuery);
                const userQuestions = aiChatsSnapshot.docs.map(d => (d.data() as AiChatMessage).question);
                
                // Fetch all therapist chats for the user
                const therapistChatsQuery = query(collectionGroup(db, 'messages'), where('senderId', '==', user.uid));
                const therapistChatsSnapshot = await getDocs(therapistChatsQuery);
                const userTherapistMessages = therapistChatsSnapshot.docs.map(d => (d.data() as ChatMessage).text);
                
                const allMessages = [...userQuestions, ...userTherapistMessages];

                if (allMessages.length === 0) {
                    setRatio(0);
                    setSentimentCounts({ positive: 0, negative: 0, neutral: 0 });
                    setLoading(false);
                    return;
                }

                // Analyze sentiment
                const sentimentResult = await analyzeChatSentiment({ messages: allMessages });
                setSentimentCounts(sentimentResult);
                
                // Calculate Losada Ratio
                const { positive, negative } = sentimentResult;
                const calculatedRatio = negative > 0 ? positive / negative : positive > 0 ? Infinity : 0;
                setRatio(calculatedRatio);

                // Fetch suggestions if ratio is low
                if (calculatedRatio < 3 && calculatedRatio !== Infinity && (positive > 0 || negative > 0)) {
                    const suggestionsResult = await generatePositivitySuggestions(sentimentResult);
                    setSuggestions(suggestionsResult.suggestions);
                }

            } catch (err) {
                console.error("Error in Losada Ratio widget:", err);
                setError("Could not analyze your positivity ratio at this time.");
            } finally {
                setLoading(false);
            }
        };

        fetchAndAnalyzeChats();

    }, [user]);

    const getRatioInfo = () => {
        if (ratio === null) return { text: "Analyzing...", color: "bg-gray-400", description: "Calculating your positivity ratio..." };
        if (ratio === Infinity || ratio >= 3) return { text: "Flourishing", color: "bg-green-500", description: "You're in a great space! Your interactions show a strong positive mindset." };
        if (ratio > 1) return { text: "Getting By", color: "bg-yellow-500", description: "You have more positive than negative interactions, which is a good foundation." };
        if (ratio > 0) return { text: "Languishing", color: "bg-orange-500", description: "Your negative interactions are outweighing the positive. Let's work on that." };
        return { text: "Stuck", color: "bg-red-500", description: "It seems you're in a tough spot. Remember, it's okay to ask for help." };
    };
    
    const { text: ratioText, color: ratioColor, description: ratioDescription } = getRatioInfo();
    const progressValue = ratio === null ? 0 : ratio === Infinity ? 100 : Math.min((ratio / 5) * 100, 100);

    if (loading) {
        return <Card>
            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
        </Card>
    }

    if (error) {
        return <Card className="border-destructive">
             <CardHeader className="flex-row items-center gap-4">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-destructive">Analysis Error</CardTitle>
             </CardHeader>
             <CardContent><p className="text-muted-foreground">{error}</p></CardContent>
        </Card>
    }
    
    if (sentimentCounts?.positive === 0 && sentimentCounts?.negative === 0) {
        return <Card>
            <CardHeader>
                 <CardTitle className="font-headline flex items-center gap-3"><Sparkles className="text-primary" />Your Positivity Ratio</CardTitle>
                 <CardDescription>Start chatting with the AI or a therapist to analyze your mindset.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-6">
                    <p>No chat history found to analyze yet.</p>
                </div>
            </CardContent>
        </Card>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-3"><TrendingUp className="text-primary" />Your Positivity Ratio</CardTitle>
                <CardDescription>Based on your recent AI and therapist chats, reflecting your mindset.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-lg">{ratioText}</p>
                        <p className="text-sm font-mono p-1.5 rounded-md bg-muted">{ratio === Infinity ? '3.0+' : ratio?.toFixed(1)} : 1</p>
                    </div>
                    <Progress value={progressValue} className={cn("h-3", ratioColor)} />
                    <p className="text-xs text-muted-foreground mt-2">{ratioDescription}</p>
                </div>
                
                {suggestions && (
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                         <h4 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="h-5 w-5 text-yellow-400" /> A Few Suggestions</h4>
                         <div className="prose prose-sm text-foreground max-w-none">
                            {suggestions.split('\n').map((line, index) => {
                                // Basic markdown parsing for bullet points
                                if (line.startsWith('- ') || line.startsWith('* ')) {
                                    return <p key={index}>{line.substring(2)}</p>;
                                }
                                return <p key={index}>{line}</p>;
                            })}
                         </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
