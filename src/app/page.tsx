
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Calendar, User, Stethoscope, FileText, Shield, Handshake } from 'lucide-react';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useTranslation, type Translations } from '@/hooks/use-translation';

const translations: Translations = {
  en: {
    title: "Mindset Theater",
    headline: "Find Your Path to a Healthier Mind",
    subheadline: "Mindset Theater offers AI-powered support and seamless connections with professional therapists to guide you on your path to mental wellness.",
    getClient: "Get Started as a Client",
    getTherapist: "Join as a Therapist",
    supportiveSpace: "A Supportive Space for Everyone",
    supportiveSpaceDesc: "Whether you're seeking support or providing it, our platform is designed for you.",
    forClients: "For Clients",
    forClientsDesc: "Your personal wellness companion.",
    clientFeature1: "Chat with our supportive AI, available 24/7 for guidance and a listening ear.",
    clientFeature2: "Easily browse and book sessions with qualified therapists who fit your needs.",
    clientFeature3: "Access motivational content to inspire and uplift you on your journey.",
    forTherapists: "For Therapists",
    forTherapistsDesc: "Streamline your practice and reach more clients.",
    therapistFeature1: "Manage your appointments and client information with our intuitive booking system.",
    therapistFeature2: "Share motivational quotes and resources to engage and support the community.",
    therapistFeature3: "Connect with a broader audience seeking your expertise and guidance.",
    howItWorks: "How It Works",
    howItWorksStep1Title: "Sign Up as a Client or Therapist",
    howItWorksStep1Desc: "Create your account in minutes to get started.",
    howItWorksStep2Title: "Explore & Connect",
    howItWorksStep2Desc: "Clients can talk to the AI, browse therapists, and book sessions. Therapists can manage their profile and bookings.",
    howItWorksStep3Title: "Begin Your Journey",
    howItWorksStep3Desc: "Engage in secure chats, attend sessions, and access motivational content.",
    legal: "Legal & Information",
    privacyPolicy: "Privacy Policy",
    terms: "Terms & Conditions",
    copyright: "© {year} Mindset Theater. All rights reserved.",
    developer: "Developed by Goodluck Stanley",
    login: "Login",
    signup: "Sign Up",
  },
  sw: {
    title: "Jukwaa la Mindset",
    headline: "Tafuta Njia Yako ya Kuwa na Akili Yenye Afya",
    subheadline: "Jukwaa la Mindset linatoa msaada unaoendeshwa na AI na uhusiano rahisi na wataalamu wa tiba ili kukuongoza kwenye njia yako ya ustawi wa akili.",
    getClient: "Anza kama Mteja",
    getTherapist: "Jiunge kama Mtaalamu",
    supportiveSpace: "Nafasi ya Msaada kwa Kila Mtu",
    supportiveSpaceDesc: "Iwe unatafuta msaada au unatoa, jukwaa letu limeundwa kwa ajili yako.",
    forClients: "Kwa Wateja",
    forClientsDesc: "Mwenzako wa ustawi wa kibinafsi.",
    clientFeature1: "Ongea na AI yetu saidizi, inayopatikana 24/7 kwa mwongozo na sikio la kusikiliza.",
    clientFeature2: "Vinjari na weka nafasi za vikao kwa urahisi na wataalamu waliohitimu wanaokufaa.",
    clientFeature3: "Pata maudhui ya kuhamasisha ili kukuinua na kukupa moyo katika safari yako.",
    forTherapists: "Kwa Wataalamu",
    forTherapistsDesc: "Rahisisha utendaji wako na wafikie wateja wengi zaidi.",
    therapistFeature1: "Simamia miadi yako na taarifa za wateja kwa mfumo wetu rahisi wa kuweka nafasi.",
    therapistFeature2: "Shiriki nukuu za kuhamasisha na rasilimali ili kushirikisha na kusaidia jamii.",
    therapistFeature3: "Ungana na hadhira pana zaidi inayotafuta utaalamu na mwongozo wako.",
    howItWorks: "Inavyofanya Kazi",
    howItWorksStep1Title: "Jisajili kama Mteja au Mtaalamu",
    howItWorksStep1Desc: "Fungua akaunti yako ndani ya dakika chache ili kuanza.",
    howItWorksStep2Title: "Gundua na Ungana",
    howItWorksStep2Desc: "Wateja wanaweza kuzungumza na AI, kuvinjari wataalamu, na kuweka vikao. Wataalamu wanaweza kusimamia wasifu na uhifadhi wao.",
    howItWorksStep3Title: "Anza Safari Yako",
    howItWorksStep3Desc: "Shiriki katika mazungumzo salama, hudhuria vikao, na pata maudhui ya kuhamasisha.",
    legal: "Sheria na Taarifa",
    privacyPolicy: "Sera ya Faragha",
    terms: "Vigezo na Masharti",
    copyright: "© {year} Jukwaa la Mindset. Haki zote zimehifadhiwa.",
    developer: "Imetengenezwa na Goodluck Stanley",
    login: "Ingia",
    signup: "Jisajili",
  }
};


export default function Home() {
  const { t } = useTranslation(translations);

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50 dark:bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sticky top-0 bg-secondary/50 dark:bg-background/80 backdrop-blur-sm z-20">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold font-headline text-foreground">
              {t('title')}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link href="/login">{t('login')}</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">{t('signup')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
            {t('headline')}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            {t('subheadline')}
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">{t('getClient')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/signup">{t('getTherapist')}</Link>
            </Button>
          </div>
        </section>

        <section id="how-it-works" className="py-16 md:py-24 bg-background dark:bg-secondary/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('howItWorks')}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="p-4 rounded-full bg-primary/20 text-primary mb-4">
                            <User className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold font-headline mb-2">{t('howItWorksStep1Title')}</h3>
                        <p className="text-muted-foreground">{t('howItWorksStep1Desc')}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 rounded-full bg-primary/20 text-primary mb-4">
                            <Bot className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold font-headline mb-2">{t('howItWorksStep2Title')}</h3>
                        <p className="text-muted-foreground">{t('howItWorksStep2Desc')}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 rounded-full bg-primary/20 text-primary mb-4">
                            <Calendar className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold font-headline mb-2">{t('howItWorksStep3Title')}</h3>
                        <p className="text-muted-foreground">{t('howItWorksStep3Desc')}</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-background dark:bg-background/60 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('supportiveSpace')}</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                {t('supportiveSpaceDesc')}
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
                      <CardTitle className="font-headline text-2xl">{t('forClients')}</CardTitle>
                      <CardDescription>{t('forClientsDesc')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-lg">
                  <div className="flex items-start gap-4">
                    <Bot className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>{t('clientFeature1')}</p>
                  </div>
                   <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>{t('clientFeature2')}</p>
                  </div>
                   <div className="flex items-start gap-4">
                    <ArrowRight className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>{t('clientFeature3')}</p>
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
                      <CardTitle className="font-headline text-2xl">{t('forTherapists')}</CardTitle>
                      <CardDescription>{t('forTherapistsDesc')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-lg">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>{t('therapistFeature1')}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <ArrowRight className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>{t('therapistFeature2')}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <User className="h-6 w-6 mt-1 text-accent-foreground shrink-0"/>
                    <p>{t('therapistFeature3')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="legal" className="py-16 md:py-24 bg-secondary/30 dark:bg-secondary/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('legal')}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader className="flex-row items-center gap-4">
                           <Shield className="h-8 w-8 text-primary" />
                           <CardTitle className="font-headline">{t('privacyPolicy')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm mb-4">Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.</p>
                            <Button variant="outline" asChild><Link href="#">Read Policy</Link></Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center gap-4">
                           <Handshake className="h-8 w-8 text-primary" />
                           <CardTitle className="font-headline">{t('terms')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm mb-4">By using Mindset Theater, you agree to our terms and conditions. Please review them carefully.</p>
                            <Button variant="outline" asChild><Link href="#">Read Terms</Link></Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        <div className="mt-4 text-xs space-y-1">
          <p className="font-semibold text-primary">{t('developer')}</p>
          <p>
            <a href="mailto:goodluckstanley20@gmail.com" className="text-primary hover:underline">goodluckstanley20@gmail.com</a>
            <span className="mx-2 text-muted-foreground">|</span>
            <a href="tel:0678971494" className="text-primary hover:underline">0678971494</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
