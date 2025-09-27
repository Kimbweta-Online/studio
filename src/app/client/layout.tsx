
"use client";

import React, { useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Bot, CalendarDays, LayoutGrid, LogOut, MessageCircle, User } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isActive = (path: string) => pathname.startsWith(path);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
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
    <div className="flex min-h-screen">
      <aside className="w-64 flex-shrink-0 border-r bg-background flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8">
            <Logo />
            <span className="font-bold font-headline text-lg">
              Mindset Theater
            </span>
        </div>

        <nav className="flex-1 space-y-2">
            <Link href="/client/dashboard" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/client/dashboard") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
                <LayoutGrid /><span>Dashboard</span>
            </Link>
            <Link href="/client/chat" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/client/chat") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
                <MessageCircle /><span>Chats</span>
            </Link>
             <Link href="/client/ai-chat" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/client/ai-chat") ? 'bg-accent text-accent-foreground' : 'hover B-accent'}`}>
                <Bot /><span>AI Chat</span>
            </Link>
             <Link href="/client/booking" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/client/booking") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
                <CalendarDays /><span>Booking</span>
            </Link>
             <Link href="/client/profile" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/client/profile") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
                <User /><span>Profile</span>
            </Link>
        </nav>

        <div className="mt-auto space-y-4">
           <div className="flex items-center gap-3">
              <Avatar>
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Client"} />
                  <AvatarFallback className="bg-secondary text-lg flex items-center justify-center">
                    {(user.displayName || "C").charAt(0)}
                  </AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                  <span className="font-semibold truncate">{user.displayName || "Client User"}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2">
              <LogOut/>
              <span>Logout</span>
          </Button>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-end p-4 border-b bg-background sticky top-0 z-10 h-16">
           <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Welcome back, {user.displayName || "Client"}!</p>
           </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-secondary/50">{children}</main>
      </div>
    </div>
  );
}
