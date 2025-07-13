import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clients, therapists } from "@/lib/data";
import { Upload } from "lucide-react";

export default function TherapistDashboard() {
    const onlineUsers = [...clients.filter(c => c.isOnline), ...therapists.filter(t => t.isOnline)];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Therapist Dashboard</h1>
        <p className="text-muted-foreground">Manage your content and see who's active.</p>
      </div>

       <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Upload a Motivational Quote</CardTitle>
                        <CardDescription>Share some inspiration with the community.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g., Embrace the Journey" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="e.g., Every step is progress..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <Input id="image" type="file" />
                        </div>
                        <Button><Upload className="mr-2 h-4 w-4" /> Upload Quote</Button>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Active Users</CardTitle>
                        <CardDescription>Users currently online.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {onlineUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="https://placehold.co/100x100.png" alt={user.name} />
                                        <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span>{user.name}</span>
                                </div>
                                {'specialty' in user ? <Badge variant="outline">Therapist</Badge> : <Badge variant="secondary">Client</Badge>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
       </div>

    </div>
  );
}
