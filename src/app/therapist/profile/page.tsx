
"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { bookings, therapists } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function TherapistProfilePage() {
    const currentTherapist = therapists[0];
    const totalBookings = bookings.filter(b => b.therapistId === currentTherapist.id).length;
    const completedBookings = bookings.filter(b => b.therapistId === currentTherapist.id && b.status === 'Completed').length;
    const upcomingBookings = bookings.filter(b => b.therapistId === currentTherapist.id && (b.status === 'Pending' || b.status === 'Confirmed')).length;

    const [photoPreview, setPhotoPreview] = useState<string | null>(currentTherapist.imageUrl);

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
                      <form onSubmit={(e) => { e.preventDefault(); alert('Profile saved!'); }} className="space-y-4">
                        <div className="flex items-center gap-4">
                             <Avatar className="h-20 w-20">
                                {photoPreview ? (
                                    <AvatarImage src={photoPreview} alt={currentTherapist.name} />
                                ) : (
                                    <AvatarImage src={currentTherapist.imageUrl} alt={currentTherapist.name} />
                                )}
                                <AvatarFallback>{currentTherapist.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                             <div>
                                <Label htmlFor="photo-upload" className="cursor-pointer">
                                    <Button asChild>
                                        <span>Change Photo</span>
                                    </Button>
                                </Label>
                                <Input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={currentTherapist.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                <Input id="specialty" defaultValue={currentTherapist.specialty} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="bio">Short Bio</Label>
                            <Textarea id="bio" placeholder="Tell clients about your approach..." rows={4} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="availability-status" defaultChecked={currentTherapist.isOnline} />
                            <Label htmlFor="availability-status">Available for new bookings</Label>
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
