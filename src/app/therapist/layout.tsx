
"use client";

import React, { useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { CalendarCheck, LayoutGrid, LogOut, MessageCircle, User } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';


export default function TherapistLayout({
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
    } else if (user) {
        const fetchUserData = async () => {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                if(data.role !== 'therapist') {
                    router.push('/login');
                    return;
                }
            } else {
                 router.push('/login');
            }
        };
        fetchUserData();
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
            <Link href="/therapist/dashboard" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/therapist/dashboard") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
                <LayoutGrid /><span>Dashboard</span>
            </Link>
            <Link href="/therapist/chats" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/therapist/chats") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
                <MessageCircle /><span>Chats</span>
            </Link>
            <Link href="/therapist/booking" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/therapist/booking") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
                <CalendarCheck /><span>Bookings</span>
            </Link>
            <Link href="/therapist/profile" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/therapist/profile") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
                <User /><span>Profile</span>
            </Link>
        </nav>

        <div className="mt-auto space-y-4">
           <div className="flex items-center gap-3">
              <Avatar>
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Therapist"} />
                  <AvatarFallback className="bg-secondary text-lg flex items-center justify-center">
                    {(user.displayName || "T").charAt(0)}
                  </AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                  <span className="font-semibold truncate">{user.displayName || "Therapist"}</span>
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
              <p className="text-sm text-muted-foreground">Welcome back, {user.displayName || "Therapist"}!</p>
           </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-secondary/50">{children}</main>
      </div>
    </div>
  );
}
