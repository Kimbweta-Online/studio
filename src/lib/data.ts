

import type { Timestamp } from "firebase/firestore";

// This file can now be used for defining types and interfaces,
// as the static data is no longer needed.

export type User = {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  role: 'client' | 'therapist';
  isOnline: boolean;
  imageUrl?: string;
  phone?: string;
  // Therapist-specific fields
  specialty?: string;
  bio?: string;
}

export type Therapist = User & {
  role: 'therapist';
  specialty: string;
};

export type Quote = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string; // UID of the therapist who posted
  authorName: string;
  createdAt: Timestamp;
};

export type Booking = {
  id:string;
  therapistId: string;
  clientId: string;
  clientName: string;
  date: Date; // Firestore Timestamps will be converted to this
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
};

// The static arrays (therapists, quotes, bookings, clients) have been removed.
// The application will now fetch this data from Firebase Firestore.
export const quotes: Omit<Quote, 'id' | 'authorId' | 'authorName' | 'createdAt'>[] = [
  { 
    title: 'The Power of Yet', 
    description: "Embracing challenges is a step towards growth. Instead of 'I can't do it,' try 'I can't do it... yet.'", 
    imageUrl: 'https://placehold.co/600x400.png', 
  },
  { 
    title: 'Breathe in, Breathe out', 
    description: "Your breath is your anchor. In moments of chaos, return to the simple rhythm of your breath.", 
    imageUrl: 'https://placehold.co/600x400.png', 
  },
  { 
    title: 'Connection is Key', 
    description: "Healing happens in connection. Reach out, share, and listen. You are not alone.", 
    imageUrl: 'https://placehold.co/600x400.png', 
  },
   { 
    title: 'Small Steps Forward', 
    description: "Progress isn't always a giant leap. Celebrate the small steps you take each day.", 
    imageUrl: 'https://placehold.co/600x400.png', 
  },
];
