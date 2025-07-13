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
import { Bot, CalendarDays, LayoutGrid, LogOut, User } from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

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
                <SidebarMenuButton asChild isActive={isActive("/client/dashboard")}>
                  <Link href="/client/dashboard">
                    <LayoutGrid />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/ai-chat")}>
                  <Link href="/client/ai-chat">
                    <Bot />
                    <span>AI Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/booking")}>
                  <Link href="/client/booking">
                    <CalendarDays />
                    <span>Booking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/profile")}>
                  <Link href="/client/profile">
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
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Alex Johnson" />
                    <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold">Alex Johnson</span>
                    <span className="text-xs text-muted-foreground">Client</span>
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
                <p className="text-sm text-muted-foreground">Welcome back, Client!</p>
             </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
