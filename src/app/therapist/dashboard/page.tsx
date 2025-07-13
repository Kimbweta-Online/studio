
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
    id: string;
    name: string;
    role: 'client' | 'therapist';
    isOnline: boolean;
    imageUrl?: string;
}

export default function TherapistDashboard() {
    const { toast } = useToast();
    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchActiveUsers = async () => {
            setLoading(true);
            try {
                const usersQuery = query(
                    collection(db, "users"),
                    where("isOnline", "==", true),
                    orderBy("name")
                );
                const querySnapshot = await getDocs(usersQuery);
                const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setActiveUsers(users);
            } catch (error) {
                console.error("Error fetching active users: ", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch active users."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchActiveUsers();
    }, [toast]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleQuoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would implement the logic to save the quote to Firestore
        // For now, we'll just show a toast notification.
        toast({
            title: "Quote Uploaded",
            description: "Your motivational quote has been shared with the community.",
        });
        setImagePreview(null);
        (e.target as HTMLFormElement).reset();
    };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Therapist Dashboard</h1>
        <p className="text-muted-foreground">Manage your content and see who's active.</p>
      </div>

       <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Upload a Motivational Quote</CardTitle>
                        <CardDescription>Share some inspiration with the community.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleQuoteSubmit} className="space-y-4">
                          <div className="space-y-2">
                              <Label htmlFor="title">Title</Label>
                              <Input id="title" placeholder="e.g., Embrace the Journey" required/>
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea id="description" placeholder="e.g., Every step is progress..." required/>
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="image">Image</Label>
                              <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
                          </div>
                          {imagePreview && (
                            <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden border">
                                <Image
                                    src={imagePreview}
                                    alt="Quote preview"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                          )}
                          <Button type="submit"><Upload className="mr-2 h-4 w-4" /> Upload Quote</Button>
                      </form>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Active Users</CardTitle>
                        <CardDescription>Users currently online.</CardDescription>
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
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.imageUrl || 'https://placehold.co/100x100.png'} alt={user.name} />
                                            <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                    </div>
                                    {user.role === 'therapist' ? <Badge variant="outline">Therapist</Badge> : <Badge variant="secondary">Client</Badge>}
                                </div>
                            )) : <p className="text-sm text-muted-foreground text-center py-4">No users are currently online.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
       </div>

    </div>
  );
}
