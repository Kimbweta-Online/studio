
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@/lib/data";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const avatarOptions = ['😀', '🧠', '❤️', '🧘', '⭐', '💡', '🤝', '👤'];

export default function ClientProfilePage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                setLoading(false);
                return;
            };

            setLoading(true);
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data);
                    setSelectedAvatar(data.avatar || '😀');
                }

                // Fetch bookings
                const bookingsQuery = query(collection(db, "bookings"), where("clientId", "==", user.uid));
                const bookingsSnapshot = await getDocs(bookingsQuery);
                const userBookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
                setBookings(userBookings);

            } catch (error) {
                console.error("Error fetching user data:", error);
                toast({ variant: "destructive", title: "Error", description: "Could not fetch user data." });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, toast]);
    
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !userData) return;
        setIsSaving(true);

        try {
            const form = e.currentTarget;
            const name = (form.elements.namedItem("name") as HTMLInputElement).value;
            const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
            
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                name: name,
                phone: phone,
                avatar: selectedAvatar,
            });

            if (auth.currentUser) {
              await updateProfile(auth.currentUser, { displayName: name });
            }
            
            setUserData((prev: any) => ({ ...prev, name, phone, avatar: selectedAvatar }));

            toast({
                title: "Profile Saved",
                description: "Your personal details have been updated successfully.",
            });
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast({ variant: "destructive", title: "Update Failed", description: `Could not update your profile: ${error.message}` });
        } finally {
            setIsSaving(false);
        }
    }

  if (loading || !userData) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><Skeleton className="h-96 w-full" /></div>
          <div className="lg:col-span-1"><Skeleton className="h-64 w-full" /></div>
        </div>
      </div>
    );
  }

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const upcomingBookings = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and view your journey.</p>
      </div>

       <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Personal Details</CardTitle>
                        <CardDescription>Update your name and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-2 mb-4">
                                <Label>Choose Your Avatar</Label>
                                <RadioGroup
                                    value={selectedAvatar}
                                    onValueChange={setSelectedAvatar}
                                    className="flex flex-wrap gap-2 pt-2"
                                >
                                    {avatarOptions.map((avatar) => (
                                    <Label
                                        key={avatar}
                                        htmlFor={`avatar-${avatar}`}
                                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <RadioGroupItem value={avatar} id={`avatar-${avatar}`} className="sr-only peer" />
                                        <span className="text-3xl">{avatar}</span>
                                    </Label>
                                    ))}
                                </RadioGroup>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" defaultValue={userData.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue={userData.email} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" type="tel" defaultValue={userData.phone || ""} />
                                </div>
                            </div>
                            <Button type="submit" className="mt-6" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Booking Summary</CardTitle>
                        <CardDescription>Your activity on Mindset Theater.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Sessions</span>
                            <Badge variant="secondary" className="text-lg">{totalBookings}</Badge>
                        </div>
                        <Separator/>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Completed</span>
                            <Badge variant="secondary" className="text-lg">{completedBookings}</Badge>
                        </div>
                        <Separator/>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Upcoming</span>
                            <Badge variant="default" className="text-lg">{upcomingBookings}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
       </div>

    </div>
  );
}
