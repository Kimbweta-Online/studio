
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Phone, Trash2, Loader2, MessageCircle, Clock } from "lucide-react';
import type { Booking, Therapist } from "@/lib/data";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const timeSlots = ["09:00", "11:00", "14:00", "16:00"];
const durations = ["45", "60"];

export default function ClientBookingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingTherapists, setLoadingTherapists] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedDuration, setSelectedDuration] = useState<string | undefined>();
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    setSelectedDate(new Date());
    const fetchTherapists = async () => {
      setLoadingTherapists(true);
      try {
        const therapistsQuery = query(collection(db, "users"), where("role", "==", "therapist"));
        const therapistsSnapshot = await getDocs(therapistsQuery);
        const therapistsList = therapistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Therapist));
        setTherapists(therapistsList);
      } catch (error) {
        console.error("Error fetching therapists: ", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load therapist data." });
      } finally {
        setLoadingTherapists(false);
      }
    };
    fetchTherapists();
  }, [toast]);
  
  useEffect(() => {
    const fetchBookings = async () => {
       if (user) {
          setLoadingBookings(true);
          try {
            const bookingsQuery = query(collection(db, "bookings"), where("clientId", "==", user.uid));
            const bookingsSnapshot = await getDocs(bookingsQuery);
            const bookingsList = await Promise.all(bookingsSnapshot.docs.map(async (bookingDoc) => {
              const bookingData = bookingDoc.data();
              const date = (bookingData.date as any).toDate(); 
              return { id: bookingDoc.id, ...bookingData, date } as Booking;
            }));
            setBookings(bookingsList);
          } catch(error) {
            console.error("Error fetching bookings: ", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to load booking data." });
          } finally {
            setLoadingBookings(false);
          }
        } else {
            setLoadingBookings(false);
        }
    }
    fetchBookings();
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
    if (!user || !selectedDate || !selectedTime || !selectedDuration) {
        toast({ variant: "destructive", title: "Error", description: "Please select a date, time, and duration." });
        return;
    }
    setIsScheduling(true);

    try {
        const newBookingRef = doc(collection(db, "bookings"));
        const clientDoc = await getDoc(doc(db, "users", user.uid));

        if (!clientDoc.exists()) {
            throw new Error("Client user document not found!");
        }

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const finalDate = new Date(selectedDate);
        finalDate.setHours(hours, minutes, 0, 0);

        const newBooking: Omit<Booking, 'id'> = {
            therapistId: therapist.id,
            clientId: user.uid,
            clientName: clientDoc.data().name || "Unknown Client",
            date: finalDate,
            status: 'Pending',
            duration: parseInt(selectedDuration),
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
        setSelectedTime(undefined);
        setSelectedDuration(undefined);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }
  }
  
  const handleCancel = (bookingId: string) => {
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
        {loadingTherapists ? (
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
                    <Avatar className="h-16 w-16 text-4xl flex items-center justify-center bg-secondary">
                        {therapist.avatar || '🧑‍⚕️'}
                    </Avatar>
                    <div>
                    <CardTitle className="font-headline">{therapist.name}</CardTitle>
                    <CardDescription>{therapist.specialty}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {therapist.isOnline ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                    ) : (
                        <Badge variant="secondary">Offline</Badge>
                    )}
                </CardContent>
                <CardFooter className="flex-col items-stretch space-y-2">
                    <Button asChild>
                        <Link href={`/client/chat/${therapist.id}`}>
                            <MessageCircle className="mr-2 h-4 w-4" /> Chat Now
                        </Link>
                    </Button>
                    <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline"><CalendarDays className="mr-2 h-4 w-4" /> Book Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle className="font-headline">Schedule with {therapist.name}</DialogTitle>
                        <DialogDescription>Select a date, time, and duration for your session.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-md border"
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                />
                            </div>
                             <div>
                                <Label className="text-sm font-medium">Time Slot</Label>
                                <RadioGroup value={selectedTime} onValueChange={setSelectedTime} className="grid grid-cols-2 gap-2 mt-2">
                                    {timeSlots.map(time => (
                                        <Label key={time} htmlFor={`time-${time}`} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                            <RadioGroupItem value={time} id={`time-${time}`} className="sr-only peer" />
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{time}</span>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            </div>
                             <div>
                                <Label className="text-sm font-medium">Duration</Label>
                                 <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration} className="grid grid-cols-2 gap-2 mt-2">
                                    {durations.map(duration => (
                                        <Label key={duration} htmlFor={`duration-${duration}`} className="flex items-center justify-center rounded-md border p-3 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                            <RadioGroupItem value={duration} id={`duration-${duration}`} className="sr-only peer" />
                                            <span>{duration} min</span>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                        <Button onClick={() => handleBooking(therapist)} disabled={isScheduling || !selectedDate || !selectedTime || !selectedDuration}>
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
          {loadingBookings ? (
             Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                     <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                     </div>
                     <div className="flex items-center gap-2 self-end sm:self-center">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                     </div>
                </Card>
             ))
          ) : bookings.length > 0 ? bookings.map(booking => {
            const therapist = therapists.find(t => t.id === booking.therapistId);
            return (
              <Card key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="text-2xl flex items-center justify-center bg-secondary">
                        {therapist?.avatar || '🧑‍⚕️'}
                    </Avatar>
                    <div>
                        <p className="font-semibold">Session with {therapist?.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(booking.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            {booking.duration && ` (${booking.duration} min)`}
                        </p>
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

    