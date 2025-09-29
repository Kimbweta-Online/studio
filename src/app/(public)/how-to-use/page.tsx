
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Calendar, MessageCircle, User, Users } from "lucide-react";

export default function HowToUsePage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">How to Use Mindset Theater</h1>
        <p className="text-xl text-muted-foreground mt-2">A guide to get the most out of your mental wellness journey.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">For Clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-primary/20 text-primary mt-1">
              <User />
            </div>
            <div>
              <h3 className="font-bold text-lg">1. Sign Up and Create Your Profile</h3>
              <p className="text-muted-foreground">Start by creating a "Client" account. In your profile, you can choose an avatar that represents you. This is your personal space.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="p-2 rounded-full bg-primary/20 text-primary mt-1">
              <Bot />
            </div>
            <div>
              <h3 className="font-bold text-lg">2. Talk to Dr. Mindset</h3>
              <p className="text-muted-foreground">Navigate to the "Dr. Mindset" page anytime you need to talk. You can share what's on your mind and even upload a photo if it helps add context. Our AI is designed to provide supportive feedback, not a diagnosis.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="p-2 rounded-full bg-primary/20 text-primary mt-1">
              <Users />
            </div>
            <div>
              <h3 className="font-bold text-lg">3. Find and Book a Therapist</h3>
              <p className="text-muted-foreground">On the "Booking" page, you'll find a list of available therapists. You can see their specialty and whether they're online. When you find someone you connect with, click "Book Now" to schedule a session using the calendar.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="p-2 rounded-full bg-primary/20 text-primary mt-1">
              <MessageCircle />
            </div>
            <div>
              <h3 className="font-bold text-lg">4. Chat Directly with Your Therapist</h3>
              <p className="text-muted-foreground">Once you've booked a session, you can start a conversation directly from the "Booking" page or the "Chats" page. This is a secure space for you and your therapist to communicate.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">For Therapists</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-primary/20 text-primary mt-1">
              <User />
            </div>
            <div>
              <h3 className="font-bold text-lg">1. Set Up Your Professional Profile</h3>
              <p className="text-muted-foreground">Register as a "Therapist". Complete your profile with your name, specialty, a short bio, and an avatar. This information will be visible to potential clients.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="p-2 rounded-full bg-primary/20 text-primary mt-1">
              <Calendar />
            </div>
            <div>
              <h3 className="font-bold text-lg">2. Manage Your Bookings</h3>
              <p className="text-muted-foreground">On the "Bookings" page, you can view all incoming session requests from clients. You can update the status of each request to "Confirmed," "Completed," or "Cancelled" to keep your schedule organized.</p>
            </div>
          </div>
           <div className="flex items-start gap-4">
             <div className="p-2 rounded-full bg-primary/20 text-primary mt-1">
              <MessageCircle />
            </div>
            <div>
              <h3 className="font-bold text-lg">3. Engage with Clients</h3>
              <p className="text-muted-foreground">Use the "Chats" page to view all your conversations with clients. You can respond to messages and provide support directly through our secure messaging system.</p>
            </div>
          </div>
           <div className="flex items-start gap-4">
             <div className="p-2 rounded-full bg-primary/20 text-primary mt-1">
              <Bot />
            </div>
            <div>
              <h3 className="font-bold text-lg">4. Share Inspiration</h3>
              <p className="text-muted-foreground">From your dashboard, you can share motivational quotes with the entire community. This helps create a supportive and positive environment for all users.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
