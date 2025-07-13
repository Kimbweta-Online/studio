
"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { bookings } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function ClientProfilePage() {
    const { toast } = useToast();
    const totalBookings = bookings.filter(b => b.clientId === 'c1').length;
    const completedBookings = bookings.filter(b => b.clientId === 'c1' && b.status === 'Completed').length;
    const upcomingBookings = bookings.filter(b => b.clientId === 'c1' && (b.status === 'Pending' || b.status === 'Confirmed')).length;

    const [photoPreview, setPhotoPreview] = useState<string | null>("https://placehold.co/100x100.png");

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Profile Saved",
            description: "Your personal details have been updated successfully.",
        });
    }

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
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    {photoPreview ? (
                                        <AvatarImage src={photoPreview} alt="Alex Johnson" />
                                    ) : (
                                        <AvatarImage src="https://placehold.co/100x100.png" alt="Alex Johnson" />
                                    )}
                                    <AvatarFallback>AJ</AvatarFallback>
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
                                    <Input id="name" defaultValue="Alex Johnson" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue="alex.j@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                                </div>
                            </div>
                            <Button type="submit" className="mt-4">Save Changes</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Booking Summary</CardTitle>
                        <CardDescription>Your activity on Mindful Journey.</CardDescription>
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
