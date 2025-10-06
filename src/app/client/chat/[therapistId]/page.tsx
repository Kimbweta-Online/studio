

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

export default function ChatPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const therapistId = params.therapistId as string;

  const [therapist, setTherapist] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getChatId = (uid1: string, uid2: string) => [uid1, uid2].sort().join('_');

  useEffect(() => {
    if (!user || !therapistId) return;
    
    const determinedChatId = getChatId(user.uid, therapistId);
    setChatId(determinedChatId);
    
    const fetchTherapistData = async () => {
      try {
        const therapistDoc = await getDoc(doc(db, 'users', therapistId));
        if (therapistDoc.exists()) {
          setTherapist({ id: therapistDoc.id, ...therapistDoc.data() } as User);
        } else {
            toast({variant: "destructive", title: "Error", description: "Therapist not found."})
            router.push('/client/booking');
        }
      } catch (error) {
        console.error("Error fetching therapist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistData();

    if (determinedChatId) {
      const messagesQuery = query(collection(db, `chats/${determinedChatId}/messages`), orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        setMessages(msgs);
      }, (error) => {
        console.error("Error listening to messages:", error);
        toast({variant: "destructive", title: "Error", description: "Could not load messages."});
      });
       return () => unsubscribe();
    }
  }, [user, therapistId, router, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user || !chatId) return;

    try {
      // Check if chat document exists, if not, create it
      const chatDocRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatDocRef);
      if (!chatDoc.exists()) {
        await setDoc(chatDocRef, {
          participants: [user.uid, therapistId],
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
        // A soft delete might be better in a real app, e.g., setting a 'deleted: true' flag.
        // For simplicity, we'll just update the text.
        await updateDoc(messageRef, {
            text: "This message has been deleted.",
        });
        toast({ title: "Message Deleted" });
    } catch (error) {
        console.error("Error deleting message:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not delete message." });
    }
  }

  if (loading || !therapist) {
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
            <AvatarImage src={therapist.avatarUrl || undefined} alt={therapist.name} />
            <AvatarFallback className="bg-secondary">{therapist.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-lg">{therapist.name}</h2>
          <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
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
