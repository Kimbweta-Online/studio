
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Phone, Trash2, Loader2, MessageCircle, Clock, Dot } from 'lucide-react';
import type { Booking, Therapist } from "@/lib/data";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const generateTimeSlots = () => {
    const slots = [];
    // from 8 AM (Saa mbili asubuhi) to 9 PM (Saa tatu usiku) to allow for 1-hour sessions before 10 PM
    for (let i = 8; i <= 21; i++) { 
        slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return slots;
};

const timeSlots = generateTimeSlots();

const durations = [
    { value: "45", label: "45 min", price: 5000 },
    { value: "60", label: "1 hour", price: 7000 },
];

export default function ClientBookingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loadingTherapists, setLoadingTherapists] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedDuration, setSelectedDuration] = useState<string | undefined>();
  const [isScheduling, setIsScheduling] = useState(false);
  const [currentTherapist, setCurrentTherapist] = useState<Therapist | null>(null);

   useEffect(() => {
    const fetchTherapistsAndBookings = async () => {
      setLoadingTherapists(true);
      setLoadingBookings(true);

      try {
        // Fetch all therapists
        const therapistsQuery = query(collection(db, "users"), where("role", "==", "therapist"), where("registrationStatus", "==", "Approved"));
        const therapistsSnapshot = await getDocs(therapistsQuery);
        const therapistsList = therapistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Therapist));
        setTherapists(therapistsList);

        // Fetch all bookings for availability checks
        const allBookingsSnapshot = await getDocs(collection(db, "bookings"));
        const allBookingsList = allBookingsSnapshot.docs.map(bookingDoc => {
            const bookingData = bookingDoc.data();
            return { id: bookingDoc.id, ...bookingData, date: (bookingData.date as any).toDate() } as Booking;
        });
        setAllBookings(allBookingsList);

      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load initial data." });
      } finally {
        setLoadingTherapists(false);
        setLoadingBookings(false);
      }
    };
    fetchTherapistsAndBookings();
  }, [toast]);
  
  useEffect(() => {
    // Separate effect for fetching user-specific bookings
    const fetchMyBookings = async () => {
       if (user) {
          const userBookings = allBookings.filter(b => b.clientId === user.uid);
          setMyBookings(userBookings);
        }
    }
    if (!loadingBookings) {
        fetchMyBookings();
    }
  }, [user, allBookings, loadingBookings]);

  const getSlotsByStatus = (therapistId: string, date: Date, statuses: Array<Booking['status']>, clientId?: string) => {
    if (!date) return [];
    return allBookings
      .filter(booking => {
        const isCorrectTherapist = booking.therapistId === therapistId;
        const isCorrectDate = new Date(booking.date).toDateString() === date.toDateString();
        const hasCorrectStatus = statuses.includes(booking.status);
        const isCorrectClient = !clientId || booking.clientId === clientId;
        return isCorrectTherapist && isCorrectDate && hasCorrectStatus && isCorrectClient;
      })
      .map(booking => new Date(booking.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  };

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
        const clientData = clientDoc.data();

        if (!clientData) {
            throw new Error("Client user document not found!");
        }

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const finalDate = new Date(selectedDate);
        finalDate.setHours(hours, minutes, 0, 0);

        const durationInfo = durations.find(d => d.value === selectedDuration);

        const newBooking: Omit<Booking, 'id'> = {
            therapistId: therapist.id,
            clientId: user.uid,
            clientName: clientData.name || "Unknown Client",
            date: finalDate,
            status: 'Pending',
            duration: durationInfo ? parseInt(durationInfo.value) : 0,
            price: durationInfo ? durationInfo.price : 0,
        };
        
        await setDoc(newBookingRef, newBooking);
        
        const bookingWithId = { ...newBooking, id: newBookingRef.id, date: finalDate };
        setAllBookings(prev => [...prev, bookingWithId]);
        setMyBookings(prev => [...prev, bookingWithId]);
        
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
        setCurrentTherapist(null);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }
  }
  
  const handleCancel = (bookingId: string) => {
    // This is a placeholder. In a real app, you would update the booking status to 'Cancelled' in Firestore.
    toast({
        variant: "destructive",
        title: "Booking Cancelled",
        description: `Your booking (ID: ${bookingId}) has been cancelled.`,
    })
  }

  const confirmedSlots = currentTherapist && selectedDate ? getSlotsByStatus(currentTherapist.id, selectedDate, ['Confirmed']) : [];
  const myPendingSlots = currentTherapist && selectedDate && user ? getSlotsByStatus(currentTherapist.id, selectedDate, ['Pending'], user.uid) : [];


  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if(date && currentTherapist) {
        const slotsForDate = getSlotsByStatus(currentTherapist.id, date, ['Confirmed']);
        const firstAvailable = timeSlots.find(slot => !slotsForDate.includes(slot));
        setSelectedTime(firstAvailable);
    } else {
        setSelectedTime(undefined);
    }
  };

  const bookedDays = currentTherapist 
    ? allBookings
        .filter(b => b.therapistId === currentTherapist.id && b.status === 'Confirmed')
        .map(b => b.date)
    : [];

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
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={therapist.avatarUrl || undefined} alt={therapist.name} />
                        <AvatarFallback className="text-2xl bg-secondary">{therapist.avatar}</AvatarFallback>
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
                    <Dialog onOpenChange={(open) => {
                        if (open) {
                            setCurrentTherapist(therapist);
                        } else {
                            setCurrentTherapist(null);
                            setSelectedTime(undefined);
                            setSelectedDuration(undefined);
                        }
                    }}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><CalendarDays className="mr-2 h-4 w-4" /> Book Now</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm sm:max-w-md">
                        <DialogHeader>
                        <DialogTitle className="font-headline">Schedule with {therapist.name}</DialogTitle>
                        <DialogDescription>Select a date, time, and duration for your session. (Mon-Sat, 8am-10pm)</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    className="rounded-md border"
                                    disabled={(date) => 
                                        date < new Date(new Date().setDate(new Date().getDate() - 1)) || 
                                        date.getDay() === 0 // 0 is Sunday
                                    }
                                    modifiers={{ booked: bookedDays }}
                                     modifiersStyles={{
                                        booked: { 
                                            color: 'hsl(var(--destructive))',
                                            textDecoration: 'line-through'
                                        }
                                    }}
                                />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="time-slot" className="text-sm font-medium">Time Slot</Label>
                                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                                        <SelectTrigger id="time-slot" className="mt-2">
                                            <SelectValue placeholder="Select a time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map(time => {
                                                const isConfirmed = confirmedSlots.includes(time);
                                                const isMyPending = myPendingSlots.includes(time);
                                                const isDisabled = isConfirmed || isMyPending;
                                                return (
                                                    <SelectItem key={time} value={time} disabled={isDisabled}>
                                                        {time} {isConfirmed && "(Booked)"} {isMyPending && "(Pending)"}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div>
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration} className="grid grid-cols-2 gap-2 mt-2">
                                        {durations.map(duration => (
                                            <Label key={duration.value} htmlFor={`duration-${duration.value}`} className="flex flex-col items-center justify-center rounded-md border p-3 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                <RadioGroupItem value={duration.value} id={`duration-${duration.value}`} className="sr-only peer" />
                                                <span className="font-semibold text-sm">{duration.label}</span>
                                                <span className="text-xs text-muted-foreground">{duration.price.toLocaleString('en-US')} TZS</span>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => handleBooking(therapist)} disabled={isScheduling || !selectedDate || !selectedTime || !selectedDuration} className="w-full">
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
          ) : myBookings.length > 0 ? myBookings.map(booking => {
            const therapist = therapists.find(t => t.id === booking.therapistId);
            return (
              <Card key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={therapist?.avatarUrl || undefined} alt={therapist?.name} />
                        <AvatarFallback className="bg-secondary">{therapist?.avatar || '🧑‍⚕️'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Session with {therapist?.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(booking.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            {booking.duration && ` (${booking.duration} min)`}
                        </p>
                        {booking.price != null && (
                            <p className="text-sm font-bold text-primary">{booking.price.toLocaleString('en-US')} TZS</p>
                        )}
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
