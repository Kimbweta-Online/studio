
'use server';
/**
 * @fileOverview AI-powered mental health support flow.
 *
 * - generateMentalHealthSupport - A function that handles the generation of mental health support based on a question and an optional photo.
 * - GenerateMentalHealthSupportInput - The input type for the generateMentalhealthSupport function.
 * - GenerateMentalHealthSupportOutput - The return type for the generateMentalHealthSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMentalHealthSupportInputSchema = z.object({
  question: z.string().describe('The mental health-related question.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateMentalHealthSupportInput = z.infer<typeof GenerateMentalHealthSupportInputSchema>;

const GenerateMentalHealthSupportOutputSchema = z.object({
  answer: z.string().describe('The AI-generated mental health support. The response should be formatted in markdown.'),
});
export type GenerateMentalHealthSupportOutput = z.infer<typeof GenerateMentalHealthSupportOutputSchema>;

export async function generateMentalHealthSupport(input: GenerateMentalHealthSupportInput): Promise<GenerateMentalHealthSupportOutput> {
  return generateMentalHealthSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMentalHealthSupportPrompt',
  input: {schema: GenerateMentalHealthSupportInputSchema},
  output: {schema: GenerateMentalHealthSupportOutputSchema},
  prompt: `You are Dr. Mindset, an AI therapist. A client has asked the following question.
Your response should be short, conversational, and therapeutic. Your response must be in Markdown format.

Question: {{{question}}}

{{#if photoDataUri}}
They have also provided a photo for context. Analyze the photo for any relevant details that might inform your response, but do not describe the photo.
Photo: {{media url=photoDataUri}}
{{/if}}

Provide a supportive and helpful answer. Do not provide a diagnosis.
If the user seems to be in immediate danger or distress, provide contact information for a crisis hotline like the National Suicide Prevention Lifeline at 988.

After every response, you must conclude with a recommendation to see a therapist on the system. For example: "For more in-depth support, I recommend booking a session with one of our qualified therapists."`,
});

const generateMentalHealthSupportFlow = ai.defineFlow(
  {
    name: 'generateMentalHealthSupportFlow',
    inputSchema: GenerateMentalHealthSupportInputSchema,
    outputSchema: GenerateMentalHealthSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

