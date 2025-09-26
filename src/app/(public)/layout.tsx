
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useTranslation, type Translations } from '@/hooks/use-translation';

const translations: Translations = {
  en: {
    title: "Mindset Theater",
    legal: "Legal & Information",
    developer: "Developed by Goodluck Stanley",
    copyright: "© {year} Mindset Theater. All rights reserved.",
    login: "Login",
    signup: "Sign Up",
  },
  sw: {
    title: "Jukwaa la Mindset",
    legal: "Sheria na Taarifa",
    developer: "Imetengenezwa na Goodluck Stanley",
    copyright: "© {year} Jukwaa la Mindset. Haki zote zimehifadhiwa.",
    login: "Ingia",
    signup: "Jisajili",
  }
};


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {children}
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
