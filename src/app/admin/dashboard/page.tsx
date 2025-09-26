
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { User, Booking } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, CheckCircle, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersSnapshot, bookingsSnapshot] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "bookings")),
        ]);

        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        const bookingsList = bookingsSnapshot.docs.map(doc => {
            const data = doc.data();
            const date = (data.date as any).toDate();
            return { id: doc.id, ...data, date } as Booking;
        });

        setUsers(usersList);
        setBookings(bookingsList);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const clients = users.filter(u => u.role === 'client');
  const therapists = users.filter(u => u.role === 'therapist');

  const getStatusVariant = (status: boolean | undefined) => {
    return status ? 'default' : 'secondary';
  };
  
  const getRoleVariant = (role: string) => {
      switch(role) {
          case 'admin': return 'destructive';
          case 'therapist': return 'secondary';
          default: return 'outline';
      }
  }

  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length;

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">A complete overview of the Mindset Theater platform.</p>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{clients.length}</div>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Therapists</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{therapists.length}</div>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{completedBookings}</div>}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending/Confirmed</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{pendingBookings}</div>}
                </CardContent>
            </Card>
       </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">All Users</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-24" /></div></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-9 w-9 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            users.map(user => (
                                <TableRow key={user.id} className="hover:bg-muted/50">
                                    <TableCell>
                                      <Link href={`/admin/users/${user.id}`}>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 text-2xl flex items-center justify-center bg-secondary">
                                                <span>{user.avatar}</span>
                                            </Avatar>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                      </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(user.isOnline)}>
                                            {user.isOnline ? "Online" : "Offline"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                     <TableCell className="text-right">
                                        {user.role === 'client' && (
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <MessageSquare className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
