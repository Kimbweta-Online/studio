
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { User, Booking, ChatMessage } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Bot, Calendar, MessageCircle, Paperclip, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

type ChatWithTherapist = {
  therapist: User;
  messages: ChatMessage[];
};

type AiChatMessage = {
    id: string;
    question: string;
    answer: string;
    hasPhoto: boolean;
    timestamp: any;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: adminUser, loading: adminLoading } = useAuth();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [aiChat, setAiChat] = useState<AiChatMessage[]>([]);
  const [therapistChats, setTherapistChats] = useState<ChatWithTherapist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || adminLoading) return;
     if (!adminUser) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists() || userDoc.data().role !== 'client') {
          router.push('/admin/dashboard');
          return;
        }
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        setUser(userData);

        // Fetch bookings
        const bookingsQuery = query(collection(db, 'bookings'), where('clientId', '==', userId));
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsList = bookingsSnapshot.docs.map(d => ({ id: d.id, ...d.data(), date: (d.data().date as any).toDate() } as Booking));
        setBookings(bookingsList);
        
        // Fetch AI chat history
        const aiChatsQuery = query(collection(db, 'ai_chats'), where('userId', '==', userId), orderBy('timestamp', 'desc'));
        const aiChatsSnapshot = await getDocs(aiChatsQuery);
        const aiChatsList = aiChatsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as AiChatMessage));
        setAiChat(aiChatsList);

        // Fetch therapist chats
        const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', userId));
        const chatsSnapshot = await getDocs(chatsQuery);
        
        const therapistChatsData = await Promise.all(
          chatsSnapshot.docs.map(async (chatDoc) => {
            const chatData = chatDoc.data();
            const therapistId = chatData.participants.find((p: string) => p !== userId);
            if (!therapistId) return null;

            const therapistDoc = await getDoc(doc(db, 'users', therapistId));
            if (!therapistDoc.exists()) return null;

            const messagesQuery = query(collection(chatDoc.ref, 'messages'), orderBy('timestamp', 'asc'));
            const messagesSnapshot = await getDocs(messagesQuery);
            const messages = messagesSnapshot.docs.map(msgDoc => ({ id: msgDoc.id, ...msgDoc.data() } as ChatMessage));

            return {
              therapist: { id: therapistId, ...therapistDoc.data() } as User,
              messages,
            };
          })
        );

        setTherapistChats(therapistChatsData.filter(Boolean) as ChatWithTherapist[]);

      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, adminUser, adminLoading, router]);

  if (loading || adminLoading) {
    return <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
    </div>;
  }
  
  if (!user) {
      return <div className="text-center">User not found.</div>
  }
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'default';
      case 'Completed': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'destructive';
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <div>
            <h1 className="text-3xl font-bold font-headline">Client Details</h1>
            <p className="text-muted-foreground">Viewing data for {user.name}.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="flex-row items-center gap-4">
                 <Avatar className="h-16 w-16 text-4xl flex items-center justify-center bg-secondary">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="font-headline">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="font-semibold text-muted-foreground">Status:</span> 
                    <Badge variant={user.isOnline ? 'default' : 'secondary'}>{user.isOnline ? 'Online' : 'Offline'}</Badge>
                </div>
                 <div className="flex justify-between">
                    <span className="font-semibold text-muted-foreground">Phone:</span> 
                    <span>{user.phone || 'Not Provided'}</span>
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Calendar className="h-5 w-5"/>Booking History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {bookings.length > 0 ? bookings.map(booking => (
                    <div key={booking.id} className="text-sm">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Session on {booking.date.toLocaleDateString()}</p>
                            <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                        </div>
                        <p className="text-muted-foreground">
                            {booking.duration} min - {booking.price?.toLocaleString()} TZS
                        </p>
                    </div>
                )) : <p className="text-sm text-muted-foreground text-center py-4">No bookings found.</p>}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Bot className="h-5 w-5"/>AI Chat History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[40rem] overflow-y-auto">
                    {aiChat.length > 0 ? aiChat.map(chat => (
                        <div key={chat.id} className="p-4 rounded-lg bg-muted/50">
                            <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8 text-xl flex items-center justify-center bg-secondary">
                                    <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                                    <AvatarFallback>{user.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">Question</p>
                                    <p className="text-sm text-muted-foreground">{chat.question}</p>
                                    {chat.hasPhoto && (
                                        <div className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                                            <Paperclip className="h-3 w-3" />
                                            <span>Photo was attached</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Separator className="my-3" />
                             <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8 text-xl flex items-center justify-center bg-primary/20">
                                    <Bot className="text-primary"/>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">AI Answer</p>
                                    <p className="text-sm text-muted-foreground prose prose-sm max-w-none">{chat.answer}</p>
                                </div>
                            </div>
                             <p className="text-xs text-muted-foreground text-right mt-2">
                                {chat.timestamp ? new Date(chat.timestamp.toDate()).toLocaleString() : ''}
                            </p>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No AI chat history found for this user.</p>
                    )}
                </CardContent>
             </Card>

             <Card>
                 <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><MessageCircle className="h-5 w-5"/>Therapist Chat History</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
                    {therapistChats.length > 0 ? therapistChats.map(chat => (
                        <div key={chat.therapist.id}>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={chat.therapist.avatarUrl || undefined} alt={chat.therapist.name} />
                                    <AvatarFallback className="bg-secondary">{chat.therapist.avatar}</AvatarFallback>
                                </Avatar>
                                <h3 className="font-semibold">Conversation with {chat.therapist.name}</h3>
                            </div>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                            {chat.messages.map(msg => (
                               <div key={msg.id} className={cn("flex gap-2 items-start", msg.senderId === userId ? 'justify-end' : 'justify-start')}>
                                  <div className={cn(
                                    "rounded-lg px-3 py-2 text-sm max-w-sm", 
                                    msg.senderId === userId ? 'bg-blue-100 dark:bg-blue-900' : 'bg-muted'
                                  )}>
                                    <p>{msg.text}</p>
                                    <p className="text-xs text-muted-foreground text-right mt-1">
                                        {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleString() : ''}
                                    </p>
                                  </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    )) : <p className="text-sm text-muted-foreground text-center py-8">No therapist chats found.</p>}
                 </CardContent>
             </Card>
        </div>
      </div>

    </div>
  );
}
