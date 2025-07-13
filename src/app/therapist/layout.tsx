"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { CalendarCheck, LayoutGrid, LogOut, User } from "lucide-react";
import { therapists } from "@/lib/data";

export default function TherapistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const currentTherapist = therapists[0];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-bold font-headline text-lg">
                Mindful Journey
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/therapist/dashboard")}>
                  <Link href="/therapist/dashboard">
                    <LayoutGrid />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/therapist/booking")}>
                  <Link href="/therapist/booking">
                    <CalendarCheck />
                    <span>Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/therapist/profile")}>
                  <Link href="/therapist/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={currentTherapist.imageUrl} alt={currentTherapist.name} />
                    <AvatarFallback>{currentTherapist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold">{currentTherapist.name}</span>
                    <span className="text-xs text-muted-foreground">Therapist</span>
                </div>
            </div>
            <Button asChild variant="ghost" className="justify-start gap-2">
                <Link href="/">
                    <LogOut/>
                    <span>Logout</span>
                </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10 md:justify-end">
             <SidebarTrigger className="md:hidden" />
             <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">Welcome back, {currentTherapist.name}!</p>
             </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
