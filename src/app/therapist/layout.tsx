

"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { CalendarCheck, LayoutGrid, LogOut, MessageCircle, User, Menu, Quote, Phone, Mail, Instagram, MessageSquare } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { NotificationsDropdown } from '@/components/notifications-dropdown';

const NavLink = ({ href, isActive, children }: { href: string, isActive: boolean, children: React.ReactNode }) => (
    <Link href={href} className={`flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
        {children}
    </Link>
);


export default function TherapistLayout({
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

  const navContent = (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8 px-4 pt-4">
            <Logo />
            <span className="font-bold font-headline text-lg">
              Mindset Theater
            </span>
        </div>
        <nav className="flex-1 space-y-2 px-4">
            <NavLink href="/therapist/dashboard" isActive={isActive("/therapist/dashboard")}>
                <LayoutGrid /><span>Dashboard</span>
            </NavLink>
            <NavLink href="/therapist/chats" isActive={isActive("/therapist/chats")}>
                <MessageCircle /><span>Chats</span>
            </NavLink>
            <NavLink href="/therapist/booking" isActive={isActive("/therapist/booking")}>
                <CalendarCheck /><span>Bookings</span>
            </NavLink>
            <NavLink href="/therapist/quotes" isActive={isActive("/therapist/quotes")}>
                <Quote /><span>Quotes</span>
            </NavLink>
            <NavLink href="/therapist/profile" isActive={isActive("/therapist/profile")}>
                <User /><span>Profile</span>
            </NavLink>
        </nav>
        <div className="px-4 py-2 mt-4">
            <Separator />
            <p className="text-sm font-semibold text-muted-foreground mt-4 mb-2 px-2">Support</p>
            <a href="tel:0766300886" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground text-sm">
              <Phone className="h-4 w-4" />
              <span>0766300886</span>
            </a>
            <a href="mailto:mindsettheater@gmail.com" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground text-sm">
              <Mail className="h-4 w-4" />
              <span>mindsettheater@gmail.com</span>
            </a>
            <a href="https://www.instagram.com/mindset_theater?igsh=NjB0aTA5Y3pybWZo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground text-sm">
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </a>
            <a href="https://whatsapp.com/channel/0029Vb7Gu0L0wajqOF6oOf0y" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
        </div>
        <div className="mt-auto space-y-4 p-4 border-t">
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
                  <SheetContent side="left" className="p-0 w-72">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    </SheetHeader>
                    {navContent}
                  </SheetContent>
              </Sheet>
            </div>
           <div className="flex items-center gap-4">
              <NotificationsDropdown />
              <p className="text-sm text-muted-foreground">Welcome back, {user.displayName || "Therapist"}!</p>
           </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-secondary/50">{children}</main>
      </div>
    </div>
  );
}
