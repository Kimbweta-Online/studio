

"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, doc, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, setDoc, where, getDocs, updateDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User, ChatMessage } from '@/lib/data';
import { cn } from '@/lib/utils';
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

export default function TherapistChatPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const clientId = params.clientId as string;

  const [client, setClient] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getChatId = (uid1: string, uid2: string) => [uid1, uid2].sort().join('_');

  useEffect(() => {
    if (!user || !clientId) return;
    
    const determinedChatId = getChatId(user.uid, clientId);
    setChatId(determinedChatId);
    
    const fetchClientData = async () => {
      try {
        const clientDoc = await getDoc(doc(db, 'users', clientId));
        if (clientDoc.exists()) {
          setClient({ id: clientDoc.id, ...clientDoc.data() } as User);
        } else {
            toast({variant: "destructive", title: "Error", description: "Client not found."})
            router.push('/therapist/chats');
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();

    const messagesQuery = query(collection(db, `chats/${determinedChatId}/messages`), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, clientId, router, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user || !chatId) return;

    try {
      const chatDocRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatDocRef);
      if (!chatDoc.exists()) {
        await setDoc(chatDocRef, {
          participants: [user.uid, clientId],
          lastUpdated: serverTimestamp(),
        });
      }

      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: newMessage,
        senderId: user.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({variant: "destructive", title: "Error", description: "Could not send message."})
    }
  };

   const handleDeleteMessage = async (messageId: string) => {
    if (!chatId) return;
    try {
        const messageRef = doc(db, `chats/${chatId}/messages`, messageId);
        await updateDoc(messageRef, {
            text: "This message has been deleted.",
        });
        toast({ title: "Message Deleted" });
    } catch (error) {
        console.error("Error deleting message:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not delete message." });
    }
  }


  if (loading || !client) {
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        <header className="p-4 border-b flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </header>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-1/2 ml-auto" />
          <Skeleton className="h-10 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <header className="p-4 border-b flex items-center gap-4 bg-background sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <Avatar>
            <AvatarImage src={client.avatarUrl || undefined} alt={client.name} />
            <AvatarFallback className="bg-secondary">{client.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-lg">{client.name}</h2>
          <p className="text-sm text-muted-foreground">{client.email}</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 secure-chat">
        {messages.map((msg) => (
           <div key={msg.id} className={cn("flex gap-2 items-end group", msg.senderId === user?.uid ? 'justify-end' : 'justify-start')}>
             {msg.senderId === user?.uid && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your message. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteMessage(msg.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            )}
            <div className={cn("rounded-lg px-4 py-2 max-w-sm", msg.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.senderId !== user?.uid && (
                <p className="text-xs text-muted-foreground">
                    {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
            )}
          </div>
        ))}
         <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t bg-background sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            autoComplete="off"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}

    
