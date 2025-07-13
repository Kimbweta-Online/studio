import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { bookings, therapists } from "@/lib/data";
import { CalendarDays, Phone, Trash2, User } from "lucide-react";

export default function ClientBookingPage() {
  const clientBookings = bookings.filter(b => b.clientId === 'c1');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'default';
      case 'Completed': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Book a Session</h1>
        <p className="text-muted-foreground">Find a therapist that's right for you and schedule an appointment.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Available Therapists</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {therapists.map((therapist) => (
            <Card key={therapist.id}>
              <CardHeader className="flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={therapist.imageUrl} alt={therapist.name} data-ai-hint="portrait professional" />
                  <AvatarFallback>{therapist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="font-headline">{therapist.name}</CardTitle>
                  <CardDescription>{therapist.specialty}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {therapist.isOnline ? (
                    <Badge variant="default" className="bg-green-500/80">Online</Badge>
                ) : (
                    <Badge variant="secondary">Offline</Badge>
                )}
              </CardContent>
              <CardFooter>
                 <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full"><CalendarDays className="mr-2 h-4 w-4" /> Book Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-headline">Schedule with {therapist.name}</DialogTitle>
                      <DialogDescription>Select a date for your session.</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                       <Calendar
                          mode="single"
                          selected={new Date()}
                          className="rounded-md border"
                        />
                    </div>
                    <Button onClick={() => alert('Booking confirmed!')}>Confirm Booking</Button>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

       <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Your Bookings</h2>
        <div className="space-y-4">
          {clientBookings.length > 0 ? clientBookings.map(booking => {
            const therapist = therapists.find(t => t.id === booking.therapistId);
            return (
              <Card key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={therapist?.imageUrl} alt={therapist?.name} />
                        <AvatarFallback>{therapist?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Session with {therapist?.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {booking.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                    <Button variant="outline" size="icon" asChild>
                        <a href={`tel:${therapist?.phone}`}><Phone className="h-4 w-4" /></a>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => alert(`Cancelled booking ${booking.id}`)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </Card>
            )
          }) : (
            <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <CalendarDays className="h-12 w-12 mb-4" />
                <p>You have no upcoming bookings.</p>
                <p className="text-sm">Ready to start? Book a session with one of our therapists above.</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
