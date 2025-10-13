
import type { Timestamp } from "firebase/firestore";

// This file can now be used for defining types and interfaces,
// as the static data is no longer needed.

export type User = {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  role: 'client' | 'therapist' | 'admin';
  isOnline: boolean;
  phone: string;
  avatar?: string;
  avatarUrl?: string | null;
  // Therapist-specific fields
  specialty?: string;
  bio?: string;
  registrationStatus?: 'Pending' | 'Approved' | 'Denied';
}

export type Therapist = User & {
  role: 'therapist';
  specialty: string;
};

export type Booking = {
  id:string;
  therapistId: string;
  clientId: string;
  clientName: string;
  date: Date; // Firestore Timestamps will be converted to this
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  duration?: number;
};

export type ChatMessage = {
    id: string;
    text: string;
    senderId: string;
    timestamp: Timestamp;
    imageUrl?: string;
    voiceUrl?: string;
}

export type Quote = {
    id: string;
    text: string;
    emoji?: string;
    authorName: string; // Name of the therapist or admin who created it
    authorId: string;
    createdAt: Timestamp;
}

export type Notification = {
    id: string;
    userId: string; // The user who should receive the notification
    title: string;
    body: string;
    link: string;
    read: boolean;
    createdAt: Timestamp;
}
