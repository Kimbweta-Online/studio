
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateMentalHealthSupport } from "@/ai/flows/generate-mental-health-support";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2, Send, Smile, Frown, Meh, Angry, Laugh } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const emotions = [
    { value: 'Happy', emoji: '😊', icon: Smile },
    { value: 'Sad', emoji: '😢', icon: Frown },
    { value: 'Neutral', emoji: '😐', icon: Meh },
    { value: 'Angry', emoji: '😠', icon: Angry },
    { value: 'Joyful', emoji: '😂', icon: Laugh },
];

const formSchema = z.object({
  question: z.string().min(10, {
    message: "Please ask a more detailed question (at least 10 characters).",
  }),
  emotion: z.string({
    required_error: "Please select how you're feeling.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function AiChatForm() {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setAiResponse(null);

    try {
      const result = await generateMentalHealthSupport({
        question: data.question,
        emotion: data.emotion,
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
          <CardDescription>Share your thoughts and select an emotion to get supportive feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="emotion"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>How are you feeling right now?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-2 pt-2"
                      >
                        {emotions.map((emotion) => (
                           <FormItem key={emotion.value} className="flex items-center space-x-2 space-y-0">
                               <FormControl>
                                   <RadioGroupItem value={emotion.value} id={`emotion-${emotion.value}`} className="sr-only" />
                               </FormControl>
                               <FormLabel
                                htmlFor={`emotion-${emotion.value}`}
                                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                               >
                                  <emotion.icon className="h-6 w-6 mb-1" />
                                  <span className="text-2xl">{emotion.emoji}</span>
                               </FormLabel>
                           </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <Smile className="mx-auto h-12 w-12 mb-4" />
                    <p>Your AI-generated response will appear here once you submit your question and emotion.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
