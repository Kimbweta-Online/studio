
"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Phone, Trash2, Loader2 } from "lucide-react";
import type { Booking, Therapist } from "@/lib/data";
import { useAuth } from "@/context/auth-context";

export default function ClientBookingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch therapists
        const therapistsQuery = query(collection(db, "users"), where("role", "==", "therapist"));
        const therapistsSnapshot = await getDocs(therapistsQuery);
        const therapistsList = therapistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Therapist));
        setTherapists(therapistsList);

        // Fetch client's bookings
        if (user) {
          const bookingsQuery = query(collection(db, "bookings"), where("clientId", "==", user.uid));
          const bookingsSnapshot = await getDocs(bookingsQuery);
          const bookingsList = await Promise.all(bookingsSnapshot.docs.map(async (bookingDoc) => {
            const bookingData = bookingDoc.data();
            // Firestore timestamps need to be converted to JS Dates
            const date = (bookingData.date as any).toDate(); 
            return { id: bookingDoc.id, ...bookingData, date } as Booking;
          }));
          setBookings(bookingsList);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load booking data." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, toast]);
  

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'default';
      case 'Completed': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'destructive';
    }
  };
  
  const handleBooking = async (therapist: Therapist) => {
    if (!user || !selectedDate) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in and select a date." });
        return;
    }
    setIsScheduling(true);

    try {
        const newBookingRef = doc(collection(db, "bookings"));
        const clientDoc = await getDoc(doc(db, "users", user.uid));

        if (!clientDoc.exists()) {
            throw new Error("Client user document not found!");
        }

        const newBooking: Omit<Booking, 'id'> = {
            therapistId: therapist.id,
            clientId: user.uid,
            clientName: clientDoc.data().name || "Unknown Client",
            date: selectedDate,
            status: 'Pending',
        };
        
        await setDoc(newBookingRef, newBooking);
        
        setBookings(prev => [...prev, { ...newBooking, id: newBookingRef.id }]);
        
        toast({
            title: "Booking Request Sent",
            description: "Your session request has been sent and is now pending confirmation.",
        });
    } catch(error) {
         console.error("Error creating booking: ", error);
         toast({ variant: "destructive", title: "Booking Failed", description: "There was an error scheduling your session." });
    } finally {
        setIsScheduling(false);
        // This closes the dialog, you might want to handle this differently
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }
  }
  
  const handleCancel = (bookingId: string) => {
    // In a real app, you would update the document in Firestore to have 'Cancelled' status
    // For now, we'll just show the toast.
    toast({
        variant: "destructive",
        title: "Booking Cancelled",
        description: `Your booking (ID: ${bookingId}) has been cancelled.`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Book a Session</h1>
        <p className="text-muted-foreground">Find a therapist that's right for you and schedule an appointment.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Available Therapists</h2>
        {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><Skeleton className="h-16 w-16 rounded-full" /></CardHeader><CardContent><Skeleton className="h-24 w-full"/></CardContent><CardFooter><Skeleton className="h-10 w-full"/></CardFooter></Card>
                <Card><CardHeader><Skeleton className="h-16 w-16 rounded-full" /></CardHeader><CardContent><Skeleton className="h-24 w-full"/></CardContent><CardFooter><Skeleton className="h-10 w-full"/></CardFooter></Card>
                <Card><CardHeader><Skeleton className="h-16 w-16 rounded-full" /></CardHeader><CardContent><Skeleton className="h-24 w-full"/></CardContent><CardFooter><Skeleton className="h-10 w-full"/></CardFooter></Card>
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {therapists.map((therapist) => (
                <Card key={therapist.id}>
                <CardHeader className="flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                    <AvatarImage src={therapist.imageUrl || 'https://placehold.co/100x100.png'} alt={therapist.name} data-ai-hint="portrait professional" />
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
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                            />
                        </div>
                        <Button onClick={() => handleBooking(therapist)} disabled={isScheduling}>
                          {isScheduling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Confirm Booking
                        </Button>
                    </DialogContent>
                    </Dialog>
                </CardFooter>
                </Card>
            ))}
            </div>
        )}
      </section>

       <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Your Bookings</h2>
        <div className="space-y-4">
          {bookings.length > 0 ? bookings.map(booking => {
            const therapist = therapists.find(t => t.id === booking.therapistId);
            return (
              <Card key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={therapist?.imageUrl || 'https://placehold.co/100x100.png'} alt={therapist?.name} />
                        <AvatarFallback>{therapist?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Session with {therapist?.name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(booking.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                    <Button variant="outline" size="icon" asChild>
                        <a href={`tel:${therapist?.phone}`}><Phone className="h-4 w-4" /></a>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleCancel(booking.id)}>
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
