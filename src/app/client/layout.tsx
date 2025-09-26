
"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Bot, CalendarDays, LayoutGrid, LogOut, MessageCircle, User, Bell } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, updateDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Notification } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [avatar, setAvatar] = useState('😀');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isActive = (path: string) => pathname.startsWith(path);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
        const fetchUserData = async () => {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setAvatar(userDoc.data().avatar || '😀');
            }
        };
        fetchUserData();

         const notifQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(notifQuery, (snapshot) => {
            const notifs = snapshot.docs.map(d => ({id: d.id, ...d.data(), createdAt: d.data().createdAt.toDate()} as Notification));
            setNotifications(notifs);
        });

        return () => unsubscribe();
    }
  }, [user, loading, router]);
  
  const handleMarkAsRead = async (notificationId: string) => {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { isRead: true });
  }

  const handleLogout = async () => {
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { isOnline: false });
    }
    await signOut(auth);
    router.push('/login');
  };

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center h-screen">
             <p>Loading...</p>
        </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-bold font-headline text-lg">
                Mindset Theater
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/dashboard")}>
                  <Link href="/client/dashboard">
                    <LayoutGrid />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/chat")}>
                  <Link href="/client/chat">
                    <MessageCircle />
                    <span>Chats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/ai-chat")}>
                  <Link href="/client/ai-chat">
                    <Bot />
                    <span>AI Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/booking")}>
                  <Link href="/client/booking">
                    <CalendarDays />
                    <span>Booking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/profile")}>
                  <Link href="/client/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <div className="flex items-center gap-3">
                <Avatar className="bg-secondary text-2xl flex items-center justify-center">
                    {avatar}
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold">{user.displayName || "Client User"}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="justify-start gap-2">
                <LogOut/>
                <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10 md:justify-end">
             <SidebarTrigger className="md:hidden" />
             <div className="flex items-center gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                         <Button variant="outline" size="icon" className="relative">
                            <Bell />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                       <div className="p-4 border-b">
                            <h4 className="font-medium text-sm">Notifications</h4>
                        </div>
                        <ScrollArea className="h-96">
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div key={notif.id} className="p-4 border-b hover:bg-secondary">
                                        <Link href={notif.link} onClick={() => handleMarkAsRead(notif.id)}>
                                            <p className="font-semibold text-sm">{notif.title}</p>
                                            <p className="text-sm text-muted-foreground">{notif.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(notif.createdAt, { addSuffix: true })}
                                            </p>
                                        </Link>
                                         {!notif.isRead && <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-sm text-muted-foreground p-8">No notifications yet.</p>
                            )}
                        </ScrollArea>
                    </PopoverContent>
                </Popover>
                <p className="text-sm text-muted-foreground">Welcome back, {user.displayName || "Client"}!</p>
             </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

    