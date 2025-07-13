
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
  const [avatar, setAvatar] = useState('🧑‍⚕️');
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
                setAvatar(data.avatar || '🧑‍⚕️');
            } else {
                 router.push('/login');
            }
        };
        fetchUserData();
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    if (user) {
        // Set user offline in Firestore
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
                Mindful Journey
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/therapist/dashboard")}>
                  <Link href="/therapist/dashboard">
                    <LayoutGrid />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/therapist/chats")}>
                  <Link href="/therapist/chats">
                    <MessageCircle />
                    <span>Chats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/therapist/booking")}>
                  <Link href="/therapist/booking">
                    <CalendarCheck />
                    <span>Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/therapist/profile")}>
                  <Link href="/therapist/profile">
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
                    <span className="font-semibold">{user.displayName || "Therapist"}</span>
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
                <p className="text-sm text-muted-foreground">Welcome back, {user.displayName || "Therapist"}!</p>
             </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
