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
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                             <Avatar className="h-20 w-20">
                                <AvatarImage src={currentTherapist.imageUrl} alt={currentTherapist.name} />
                                <AvatarFallback>{currentTherapist.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Change Photo</Button>
                        </div>
                        <Separator />
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
                        <Button>Save Changes</Button>
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
