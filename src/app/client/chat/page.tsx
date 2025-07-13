
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, orderBy, limit, getDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle } from 'lucide-react';
import type { User, ChatMessage } from '@/lib/data';

export default function ClientChatsListPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", user.uid));
        const chatsSnapshot = await getDocs(chatsQuery);

        const chatsData = await Promise.all(
          chatsSnapshot.docs.map(async (chatDoc) => {
            const chat = chatDoc.data();
            const therapistId = chat.participants.find((p: string) => p !== user.uid);
            
            if (!therapistId) return null;

            const therapistDoc = await getDoc(doc(db, "users", therapistId));
            const lastMessageQuery = query(collection(chatDoc.ref, 'messages'), orderBy('timestamp', 'desc'), limit(1));
            const lastMessageSnapshot = await getDocs(lastMessageQuery);
            const lastMessage = lastMessageSnapshot.docs[0]?.data() as ChatMessage | undefined;

            return {
              id: chatDoc.id,
              therapist: { id: therapistId, ...therapistDoc.data() } as User,
              lastMessage,
            };
          })
        );
        
        setChats(chatsData.filter(c => c !== null));
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Conversations</h1>
        <p className="text-muted-foreground">Continue your conversations with your therapists.</p>
      </div>
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : chats.length > 0 ? (
          chats.map(({ therapist, lastMessage }) => (
            <Link key={therapist.id} href={`/client/chat/${therapist.id}`} passHref>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12 text-2xl flex items-center justify-center bg-secondary">
                    {therapist.avatar || '🧑‍⚕️'}
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-semibold">{therapist.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {lastMessage ? lastMessage.text : 'No messages yet...'}
                    </p>
                  </div>
                  {lastMessage?.timestamp && (
                     <p className="text-xs text-muted-foreground self-start">
                        {new Date(lastMessage.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mb-4" />
            <p>You have no active chats.</p>
            <p className="text-sm">Start a conversation from the booking page.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
