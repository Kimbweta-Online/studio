
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import type { User, Booking } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, CheckCircle, Clock, MessageSquare, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboardPage() {
  const { toast } = useToast();
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

  const handleStatusChange = async (userId: string, newStatus: User['registrationStatus']) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { registrationStatus: newStatus });
            setUsers(prevUsers => 
                prevUsers.map(u => u.id === userId ? { ...u, registrationStatus: newStatus } : u)
            );
            toast({
                title: "Status Updated",
                description: `Therapist status has been changed to ${newStatus}.`,
            });
        } catch (error) {
             console.error("Error updating therapist status:", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update the therapist status.",
            });
        }
    };

  const clients = users.filter(u => u.role === 'client');
  const therapists = users.filter(u => u.role === 'therapist');

  const getStatusVariant = (status: boolean | undefined) => {
    return status ? 'default' : 'secondary';
  };

  const getRegistrationStatusVariant = (status: string | undefined) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Denied': return 'destructive';
      default: return 'outline';
    }
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
                <CardTitle className="font-headline flex items-center gap-2"><UserCheck /> Therapist Approvals</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Therapist</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Specialty</TableHead>
                            <TableHead className="text-center">Approval Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-24" /></div></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-9 w-28 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            therapists.map(therapist => (
                                <TableRow key={therapist.id} className="hover:bg-muted/50">
                                     <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={therapist.avatarUrl || undefined} alt={therapist.name} />
                                                <AvatarFallback className="text-lg bg-secondary">{therapist.avatar}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{therapist.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{therapist.email}</TableCell>
                                    <TableCell>{therapist.specialty}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={getRegistrationStatusVariant(therapist.registrationStatus)}>{therapist.registrationStatus || 'Pending'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <Select 
                                            defaultValue={therapist.registrationStatus}
                                            onValueChange={(newStatus: User['registrationStatus']) => handleStatusChange(therapist.id, newStatus)}
                                        >
                                            <SelectTrigger className="w-[120px] ml-auto">
                                                <SelectValue placeholder="Update" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Approved">Approved</SelectItem>
                                                <SelectItem value="Denied">Denied</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

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
                            users.filter(u => u.role !== 'therapist').map(user => (
                                <TableRow key={user.id} className="hover:bg-muted/50">
                                    <TableCell>
                                      <Link href={`/admin/users/${user.id}`}>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                                                <AvatarFallback className="text-lg bg-secondary">{user.avatar}</AvatarFallback>
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

    