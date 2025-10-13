
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import type { Notification } from '@/lib/data';
import { Bell, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function NotificationsDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const notificationsQuery = query(
        collection(db, 'notifications'), 
        where('userId', '==', user.uid), 
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      } as unknown as Notification));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const handleMarkAsRead = async (id: string) => {
    const notifRef = doc(db, 'notifications', id);
    await updateDoc(notifRef, { read: true });
  };
  
  const handleMarkAllAsRead = async () => {
    const unreadNotifs = notifications.filter(n => !n.read);
    for (const notif of unreadNotifs) {
        const notifRef = doc(db, 'notifications', notif.id);
        await updateDoc(notifRef, { read: true });
    }
  };


  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{unreadCount}</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-auto px-2 py-1">
                    <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
            )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map(notif => (
            <DropdownMenuItem key={notif.id} asChild className="cursor-pointer">
              <Link href={notif.link || '#'} onClick={() => !notif.read && handleMarkAsRead(notif.id)} className="flex items-start gap-3 p-2">
                 {!notif.read && <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                 <div className="flex-1 space-y-1">
                    <p className="font-semibold text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.body}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                 </div>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-muted-foreground">No new notifications</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
