
'use server';
/**
 * @fileOverview AI-powered mental health support flow.
 *
 * - generateMentalHealthSupport - A function that handles the generation of mental health support based on a question and an optional photo.
 * - GenerateMentalHealthSupportInput - The input type for the generateMentalHealthSupport function.
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
  prompt: `You are an AI mental health support assistant. A client has asked the following question related to their mental health.
Your response must be in Markdown format.

Question: {{{question}}}

{{#if photoDataUri}}
They have also provided a photo for context. Analyze the photo for any relevant details that might inform your response, but do not describe the photo.
Photo: {{media url=photoDataUri}}
{{/if}}

Provide a supportive and helpful answer to their question. Focus on providing practical advice and guidance. Do not provide a diagnosis.
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
