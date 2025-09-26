"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LayoutGrid, LogOut } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function AdminLayout({
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
                if(data.role !== 'admin') {
                    // If not an admin, redirect to login
                    router.push('/login');
                }
            } else {
                 // If no user document, redirect to login
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
            <Link href="/admin/dashboard" className={`flex items-center gap-3 p-2 rounded-lg ${isActive("/admin/dashboard") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}>
                <LayoutGrid /><span>Dashboard</span>
            </Link>
        </nav>

        <div className="mt-auto space-y-4">
           <div className="flex items-center gap-3">
              <Avatar className="bg-secondary text-2xl flex items-center justify-center">
                  <span>👑</span>
              </Avatar>
              <div className="flex flex-col truncate">
                  <span className="font-semibold truncate">{user.displayName || "Super Admin"}</span>
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
              <p className="text-sm text-muted-foreground">Welcome back, Super Admin!</p>
           </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-secondary/50">{children}</main>
      </div>
    </div>
  );
