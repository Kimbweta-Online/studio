

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, orderBy, limit, getDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle } from 'lucide-react';
import type { User, ChatMessage } from '@/lib/data';

export default function TherapistChatsListPage() {
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
            const clientId = chat.participants.find((p: string) => p !== user.uid);
            
            if (!clientId) return null;

            const clientDoc = await getDoc(doc(db, "users", clientId));
            const lastMessageQuery = query(collection(chatDoc.ref, 'messages'), orderBy('timestamp', 'desc'), limit(1));
            const lastMessageSnapshot = await getDocs(lastMessageQuery);
            const lastMessage = lastMessageSnapshot.docs[0]?.data() as ChatMessage | undefined;

            return {
              id: chatDoc.id,
              client: { id: clientId, ...clientDoc.data() } as User,
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
        <h1 className="text-3xl font-bold font-headline">Client Conversations</h1>
        <p className="text-muted-foreground">View and respond to messages from your clients.</p>
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
          chats.map(({ client, lastMessage }) => (
            <Link key={client.id} href={`/therapist/chats/${client.id}`} passHref>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.avatarUrl || undefined} alt={client.name} />
                    <AvatarFallback className="text-2xl bg-secondary">{client.avatar || '😀'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-semibold">{client.name}</p>
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
            <p className="text-sm">Clients can initiate a chat with you from your profile.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

    
