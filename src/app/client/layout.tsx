

"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Bot, CalendarDays, LayoutGrid, LogOut, MessageCircle, User, Menu } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';

const NavLink = ({ href, isActive, children }: { href: string, isActive: boolean, children: React.ReactNode }) => (
    <Link href={href} className={`flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
        {children}
    </Link>
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
  
  const navContent = (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8 px-4">
            <Logo />
            <span className="font-bold font-headline text-lg">
              Mindset Theater
            </span>
        </div>
        <nav className="flex-1 space-y-2 px-4">
            <NavLink href="/client/dashboard" isActive={isActive("/client/dashboard")}>
                <LayoutGrid /><span>Dashboard</span>
            </NavLink>
            <NavLink href="/client/chat" isActive={isActive("/client/chat")}>
                <MessageCircle /><span>Chats</span>
            </NavLink>
            <NavLink href="/client/ai-chat" isActive={isActive("/client/ai-chat")}>
                <Bot /><span>Dr. Mindset</span>
            </NavLink>
            <NavLink href="/client/booking" isActive={isActive("/client/booking")}>
                <CalendarDays /><span>Booking</span>
            </NavLink>
            <NavLink href="/client/profile" isActive={isActive("/client/profile")}>
                <User /><span>Profile</span>
            </NavLink>
        </nav>
        <div className="mt-auto space-y-4 p-4 border-t">
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
      </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 flex-shrink-0 border-r bg-background hidden md:block">
        {navContent}
      </aside>
      
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between md:justify-end p-4 border-b bg-background sticky top-0 z-10 h-16">
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                       <Button variant="ghost" size="icon">
                          <Menu />
                          <span className="sr-only">Open Menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-64">
                    {navContent}
                  </SheetContent>
              </Sheet>
            </div>
           <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Welcome back, {user.displayName || "Client"}!</p>
           </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-secondary/50">{children}</main>
      </div>
    </div>
  );
}
