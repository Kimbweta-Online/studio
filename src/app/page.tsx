import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Calendar, User, Stethoscope } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold font-headline text-foreground">
              Mindset Theater
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
            Find Your Path to a Healthier Mind
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Mindset Theater offers AI-powered support and seamless connections with professional therapists to guide you on your path to mental wellness.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Get Started as a Client</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/signup">Join as a Therapist</Link>
            </Button>
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">A Supportive Space for Everyone</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                Whether you're seeking support or providing it, our platform is designed for you.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/20 text-primary">
                      <User className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="font-headline text-2xl">For Clients</CardTitle>
                      <CardDescription>Your personal wellness companion.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-lg">
                  <div className="flex items-start gap-4">
                    <Bot className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>Chat with our supportive AI, available 24/7 for guidance and a listening ear.</p>
                  </div>
                   <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>Easily browse and book sessions with qualified therapists who fit your needs.</p>
                  </div>
                   <div className="flex items-start gap-4">
                    <ArrowRight className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>Access motivational content to inspire and uplift you on your journey.</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/20 text-primary">
                      <Stethoscope className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="font-headline text-2xl">For Therapists</CardTitle>
                      <CardDescription>Streamline your practice and reach more clients.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-lg">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>Manage your appointments and client information with our intuitive booking system.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <ArrowRight className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>Share motivational quotes and resources to engage and support the community.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <User className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>Connect with a broader audience seeking your expertise and guidance.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mindset Theater. All rights reserved.</p>
        <div className="mt-4 text-xs space-y-1">
          <p>Developed by Goodluck Stanley</p>
          <p>
            <a href="mailto:goodluckstanley20@gmail.com" className="hover:underline">goodluckstanley20@gmail.com</a>
            <span className="mx-2">|</span>
            <a href="tel:0678971494" className="hover:underline">0678971494</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
