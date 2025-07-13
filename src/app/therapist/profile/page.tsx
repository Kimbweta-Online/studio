
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { db, auth, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@/lib/data";
import { Loader2 } from "lucide-react";


export default function TherapistProfilePage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
                    setPhotoPreview(data.imageUrl || user.photoURL);
                }

                // Fetch bookings
                const bookingsQuery = query(collection(db, "bookings"), where("therapistId", "==", user.uid));
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
    
    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !userData) return;
        setIsSaving(true);

        try {
            const form = e.currentTarget;
            const name = (form.elements.namedItem("name") as HTMLInputElement).value;
            const specialty = (form.elements.namedItem("specialty") as HTMLInputElement).value;
            const bio = (form.elements.namedItem("bio") as HTMLTextAreaElement).value;
            const isAvailable = (form.elements.namedItem("availability-status") as HTMLInputElement).checked;
            let imageUrl = userData.imageUrl;
            
            if (photoFile && photoPreview) {
                 const storageRef = ref(storage, `avatars/${user.uid}/${photoFile.name}`);
                 await uploadString(storageRef, photoPreview, 'data_url');
                 imageUrl = await getDownloadURL(storageRef);
            }
            
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                name: name,
                specialty: specialty,
                bio: bio,
                isOnline: isAvailable,
                imageUrl: imageUrl,
            });

             if (auth.currentUser) {
              await updateProfile(auth.currentUser, { displayName: name, photoURL: imageUrl });
            }
            
            setUserData((prev: any) => ({ ...prev, name, specialty, bio, isOnline: isAvailable, imageUrl }));

            toast({
                title: "Profile Saved",
                description: "Your professional details have been updated successfully.",
            });
        } catch (error) {
             console.error("Error updating profile:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not update your profile." });
        } finally {
            setIsSaving(false);
        }
    };
    
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
        <h1 className="text-3xl font-bold font-headline">Therapist Profile</h1>
        <p className="text-muted-foreground">Manage your professional information and availability.</p>
      </div>

       <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Professional Details</CardTitle>
                        <CardDescription>This information will be visible to clients.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-4">
                             <Avatar className="h-20 w-20">
                                {photoPreview ? (
                                    <AvatarImage src={photoPreview} alt={userData.name} />
                                ) : (
                                    <AvatarImage src="https://placehold.co/100x100.png" alt={userData.name} />
                                )}
                                <AvatarFallback>{userData.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                             <div className="space-y-2">
                                <Label htmlFor="photo-upload">
                                    <Button asChild variant="outline">
                                        <span className="cursor-pointer">Change Photo</span>
                                    </Button>
                                </Label>
                                <Input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" defaultValue={userData.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                <Input id="specialty" name="specialty" defaultValue={userData.specialty} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="bio">Short Bio</Label>
                            <Textarea id="bio" name="bio" placeholder="Tell clients about your approach..." rows={4} defaultValue={userData.bio} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="availability-status" name="availability-status" defaultChecked={userData.isOnline} />
                            <Label htmlFor="availability-status">Available for new bookings</Label>
                        </div>
                        <Button type="submit" className="mt-4" disabled={isSaving}>
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
                        <CardDescription>Your practice at a glance.</CardDescription>
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
