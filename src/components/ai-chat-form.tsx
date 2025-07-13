"use client";

import { useState } from "react";
import Image from "next/image";
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
import { ImageIcon, Bot, Loader2, Send } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  question: z.string().min(10, {
    message: "Please ask a more detailed question (at least 10 characters).",
  }),
  photo: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "An image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .png and .webp formats are supported."
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function AiChatForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      photo: undefined,
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setAiResponse(null);

    try {
      const photoDataUri = await toBase64(data.photo[0]);
      const result = await generateMentalHealthSupport({
        question: data.question,
        photoDataUri,
      });
      setAiResponse(result.answer);
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
          <CardTitle className="font-headline text-2xl">Talk to Your AI Assistant</CardTitle>
          <CardDescription>Share an image and your thoughts to get supportive feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question or Concern</FormLabel>
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
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload a Related Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handlePhotoChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {photoPreview && (
                <div className="relative w-full h-64 mt-4 rounded-lg overflow-hidden border">
                   <Image
                      src={photoPreview}
                      alt="Uploaded preview"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                </div>
              )}

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
            <CardTitle className="font-headline text-2xl">AI Response</CardTitle>
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
                    <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                    <p>Your AI-generated response will appear here once you submit your question and image.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
