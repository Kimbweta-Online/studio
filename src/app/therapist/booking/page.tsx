import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/select"
import { bookings } from "@/lib/data";

export default function TherapistBookingPage() {

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
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map(booking => (
                             <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src="https://placehold.co/100x100.png" alt={booking.clientName} />
                                            <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{booking.clientName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {booking.date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Select defaultValue={booking.status}>
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
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>
      );
}
