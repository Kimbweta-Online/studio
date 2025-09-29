
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateMentalHealthSupport } from "@/ai/flows/generate-mental-health-support";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2, Send, Smile, Paperclip, X } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const formSchema = z.object({
  question: z.string().min(10, {
    message: "Please ask a more detailed question (at least 10 characters).",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function AiChatForm() {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeFile = () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      // Reset the file input
      const fileInput = document.getElementById('photo') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
  }


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not authenticated",
            description: "You need to be logged in to chat with the AI.",
        });
        return;
    }
    setIsLoading(true);
    setAiResponse(null);

    let photoDataUri: string | undefined = undefined;

    if (selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        photoDataUri = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    try {
      const result = await generateMentalHealthSupport({
        question: data.question,
        photoDataUri: photoDataUri,
      });
      setAiResponse(result.answer);

      // Save conversation to Firestore
      await addDoc(collection(db, "ai_chats"), {
        userId: user.uid,
        question: data.question,
        answer: result.answer,
        hasPhoto: !!photoDataUri,
        timestamp: serverTimestamp(),
      });

    } catch (error) {
      console.error("Error generating support:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get a response from the AI. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Talk to Dr. Mindset</CardTitle>
          <CardDescription>Share your thoughts and optionally add a photo for more context.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question or Concern (Required)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me what's on your mind..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                 <FormLabel>Optional Photo</FormLabel>
                 <FormControl>
                    <div className="relative">
                        <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="pl-10" />
                        <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                 </FormControl>
                 {previewUrl && (
                     <div className="mt-4 relative w-fit">
                        <img src={previewUrl} alt="Selected preview" className="rounded-md max-h-40" />
                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeFile}>
                            <X className="h-4 w-4" />
                        </Button>
                     </div>
                 )}
              </FormItem>


              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Get Support
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary/50">
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-full bg-primary/20 text-primary">
                <Bot className="h-6 w-6" />
              </div>
            <CardTitle className="font-headline text-2xl">Dr. Mindset Response</CardTitle>
          </div>
          <CardDescription>Here's some supportive feedback. Remember, this is not a diagnosis.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            )}
            {aiResponse && (
                <div className="prose prose-sm max-w-none text-foreground">
                    {aiResponse.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            )}
            {!isLoading && !aiResponse && (
                <div className="text-center text-muted-foreground py-10">
                    <Smile className="mx-auto h-12 w-12 mb-4" />
                    <p>Dr. Mindset's response will appear here once you submit your question.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
