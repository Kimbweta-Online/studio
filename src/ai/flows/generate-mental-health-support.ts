
'use server';
/**
 * @fileOverview AI-powered mental health support flow.
 *
 * - generateMentalHealthSupport - A function that handles the generation of mental health support based on a question and an expressed emotion.
 * - GenerateMentalHealthSupportInput - The input type for the generateMentalHealthSupport function.
 * - GenerateMentalHealthSupportOutput - The return type for the generateMentalHealthSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMentalHealthSupportInputSchema = z.object({
  question: z.string().describe('The mental health-related question.'),
  emotion: z.string().describe('The emotion the user is currently feeling.'),
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
  prompt: `You are an AI mental health support assistant. A client is feeling "{{emotion}}" and has asked the following question related to their mental health.
Your response must be in Markdown format.

Question: {{{question}}}

Provide a supportive and helpful answer to their question, taking into account the emotion they have expressed. Focus on providing practical advice and guidance. Do not provide a diagnosis.
If the user seems to be in immediate danger or distress, provide contact information for a crisis hotline like the National Suicide Prevention Lifeline at 988.`,
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
