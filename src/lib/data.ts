export type Therapist = {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  phone: string;
  isOnline: boolean;
};

export type Quote = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
};

export type Booking = {
  id:string;
  therapistId: string;
  clientId: string;
  clientName: string;
  date: Date;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
};

export const therapists: Therapist[] = [
  { id: '1', name: 'Dr. Evelyn Reed', specialty: 'Cognitive Behavioral Therapy', imageUrl: 'https://placehold.co/100x100.png', phone: '+1234567890', isOnline: true },
  { id: '2', name: 'Dr. Samuel Hayes', specialty: 'Mindfulness & Stress Reduction', imageUrl: 'https://placehold.co/100x100.png', phone: '+1234567891', isOnline: false },
  { id: '3', name: 'Dr. Clara Singh', specialty: 'Family & Relationship Counseling', imageUrl: 'https://placehold.co/100x100.png', phone: '+1234567892', isOnline: true },
  { id: '4', name: 'Dr. Benjamin Carter', specialty: 'Anxiety & Depression', imageUrl: 'https://placehold.co/100x100.png', phone: '+1234567893', isOnline: true },
];

export const quotes: Quote[] = [
  { 
    id: '1', 
    title: 'The Power of Yet', 
    description: "Embracing challenges is a step towards growth. Instead of 'I can't do it,' try 'I can't do it... yet.'", 
    imageUrl: 'https://placehold.co/600x400.png', 
    author: 'Dr. Evelyn Reed' ,
  },
  { 
    id: '2', 
    title: 'Breathe in, Breathe out', 
    description: "Your breath is your anchor. In moments of chaos, return to the simple rhythm of your breath.", 
    imageUrl: 'https://placehold.co/600x400.png', 
    author: 'Dr. Samuel Hayes' 
  },
  { 
    id: '3', 
    title: 'Connection is Key', 
    description: "Healing happens in connection. Reach out, share, and listen. You are not alone.", 
    imageUrl: 'https://placehold.co/600x400.png', 
    author: 'Dr. Clara Singh' 
  },
   { 
    id: '4', 
    title: 'Small Steps Forward', 
    description: "Progress isn't always a giant leap. Celebrate the small steps you take each day.", 
    imageUrl: 'https://placehold.co/600x400.png', 
    author: 'Dr. Benjamin Carter' 
  },
];

export const bookings: Booking[] = [
    { id: 'b1', therapistId: '1', clientId: 'c1', clientName: 'Alex Johnson', date: new Date(new Date().setDate(new Date().getDate() + 3)), status: 'Confirmed' },
    { id: 'b2', therapistId: '3', clientId: 'c2', clientName: 'Maria Garcia', date: new Date(new Date().setDate(new Date().getDate() + 5)), status: 'Pending' },
    { id: 'b3', therapistId: '1', clientId: 'c3', clientName: 'James Smith', date: new Date(new Date().setDate(new Date().getDate() - 2)), status: 'Completed' },
    { id: 'b4', therapistId: '4', clientId: 'c1', clientName: 'Alex Johnson', date: new Date(new Date().setDate(new Date().getDate() + 10)), status: 'Pending' },
    { id: 'b5', therapistId: '2', clientId: 'c4', clientName: 'Patricia Williams', date: new Date(new Date().setDate(new Date().getDate() + 7)), status: 'Confirmed' },
];

export const clients = [
    { id: 'c1', name: 'Alex Johnson', isOnline: true },
    { id: 'c2', name: 'Maria Garcia', isOnline: true },
    { id: 'c3', name: 'James Smith', isOnline: false },
    { id: 'c4', name: 'Patricia Williams', isOnline: true },
]
