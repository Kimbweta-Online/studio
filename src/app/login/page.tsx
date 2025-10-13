
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "User data not found in database. Please sign up first.",
        });
        await auth.signOut(); // Log out the user if their data is missing
        return;
      }
      
      const userData = userDoc.data();
      
      // Check therapist registration status
      if (userData.role === 'therapist') {
          if (userData.registrationStatus === 'Pending') {
              toast({
                  variant: "default",
                  title: "Registration Pending",
                  description: "Your registration is still pending approval. You'll be able to log in once approved.",
              });
              await auth.signOut();
              return;
          }
          if (userData.registrationStatus === 'Denied') {
               toast({
                  variant: "destructive",
                  title: "Registration Denied",
                  description: "Your registration has been denied by an administrator.",
              });
              await auth.signOut();
              return;
          }
      }

      await updateDoc(userDocRef, { isOnline: true });
      
      toast({
        title: "Login Successful",
        description: "Redirecting you to your dashboard.",
      });
      
      if (userData.role === "admin") {
          router.push("/admin/dashboard");
      } else if (userData.role === "therapist") {
          router.push("/therapist/dashboard");
      } else {
          router.push("/client/dashboard");
      }
    } catch (error: any) {
      console.error("Login error object:", error);
      let description = "An unexpected error occurred. Please try again.";
      if (error.code) {
          console.error("Firebase error code:", error.code);
          switch (error.code) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
              case 'auth/invalid-credential':
                  description = "Invalid email or password. Please check your credentials. If you're using local emulators, remember that user data is cleared on restart, so you may need to sign up again.";
                  break;
              case 'auth/too-many-requests':
                  description = "Too many login attempts. Please try again later.";
                  break;
              case 'auth/network-request-failed':
                  description = "Network error. Please check your connection and ensure Firebase emulators are running.";
                  break;
              default:
                  description = error.message;
          }
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                <Logo />
                <span className="text-xl font-bold font-headline text-foreground">
                Mindset Theater
                </span>
            </Link>
          <CardTitle className="font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link href="/forgot-password" passHref className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
