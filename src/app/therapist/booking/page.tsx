
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";
import type { Booking } from "@/lib/data";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function TherapistBookingPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const bookingsQuery = query(collection(db, "bookings"), where("therapistId", "==", user.uid));
                const bookingsSnapshot = await getDocs(bookingsQuery);
                const bookingsList = bookingsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore Timestamp to JS Date
                    const date = (data.date as Timestamp).toDate();
                    return { id: doc.id, ...data, date } as Booking;
                });
                setBookings(bookingsList.sort((a, b) => a.date.getTime() - b.date.getTime())); // Sort by oldest first
            } catch (error) {
                console.error("Error fetching bookings:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch bookings.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, toast]);

    const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
        try {
            const bookingRef = doc(db, "bookings", bookingId);
            await updateDoc(bookingRef, { status: newStatus });
            setBookings(prevBookings => 
                prevBookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
            );
            toast({
                title: "Status Updated",
                description: `Booking status has been changed to ${newStatus}.`,
            });
        } catch (error) {
             console.error("Error updating booking status:", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update the booking status.",
            });
        }
    };

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
            <h1 className="text-3xl font-bold font-headline">Client Bookings</h1>
            <p className="text-muted-foreground">View and manage all your scheduled appointments.</p>
          </div>
    
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">All Appointments</CardTitle>
                <CardDescription>A list of all past, present, and future bookings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-24" /></div></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-10 w-[120px] ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : bookings.length > 0 ? (
                            bookings.map(booking => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 text-2xl flex items-center justify-center bg-secondary">
                                                <span>😀</span>
                                            </Avatar>
                                            <span className="font-medium">{booking.clientName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {booking.date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </TableCell>
                                     <TableCell>
                                        {booking.duration ? `${booking.duration} min` : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Select 
                                            defaultValue={booking.status}
                                            onValueChange={(newStatus: Booking['status']) => handleStatusChange(booking.id, newStatus)}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Update" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>
      );
}

    

    