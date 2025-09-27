
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { FirebaseError } from "firebase/app";
import type { User } from "@/lib/data";


export default function TherapistDashboard() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchActiveUsers = async () => {
            setLoading(true);
            try {
                const usersQuery = query(
                    collection(db, "users"),
                    where("isOnline", "==", true),
                    where("role", "==", "client")
                );
                const querySnapshot = await getDocs(usersQuery);
                const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                
                // Sort users by name client-side
                const sortedUsers = usersList.sort((a, b) => a.name.localeCompare(b.name));
                
                setActiveUsers(sortedUsers);
            } catch (error) {
                console.error("Error fetching active users: ", error);
                const firebaseError = error as FirebaseError;
                toast({
                    variant: "destructive",
                    title: "Error Fetching Users",
                    description: firebaseError.message || "Could not fetch active users."
                });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchActiveUsers();
        }
    }, [user, toast]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Therapist Dashboard</h1>
        <p className="text-muted-foreground">An overview of platform activity.</p>
      </div>

       <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Welcome!</CardTitle>
                        <CardDescription>Here's a quick look at what's happening on the platform right now. You can manage your motivational quotes from the "Quotes" tab in the sidebar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Use the sidebar to navigate to your bookings, chats, and profile.</p>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Active Clients</CardTitle>
                        <CardDescription>Clients currently online.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                            ))
                        ) : (
                            activeUsers.length > 0 ? activeUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                                            <AvatarFallback className="bg-secondary">{user.avatar}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                    </div>
                                    <Badge variant="secondary">Client</Badge>
                                </div>
                            )) : <p className="text-sm text-muted-foreground text-center py-4">No clients are currently online.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
       </div>

    </div>
  );
}

    