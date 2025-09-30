
'use server';
/**
 * @fileOverview A sentiment analysis AI flow.
 *
 * - analyzeSentiment - A function that analyzes the sentiment of a given text.
 * - AnalyzeSentimentInput - The input type for the analyzeSentiment function.
 * - AnalyzeSentimentOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSentimentInputSchema = z.object({
  text: z.string().describe('The text to be analyzed for sentiment.'),
});
export type AnalyzeSentimentInput = z.infer<typeof AnalyzeSentimentInputSchema>;

const AnalyzeSentimentOutputSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('The sentiment of the text.'),
});
export type AnalyzeSentimentOutput = z.infer<typeof AnalyzeSentimentOutputSchema>;

export async function analyzeSentiment(input: AnalyzeSentimentInput): Promise<AnalyzeSentimentOutput> {
  return analyzeSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSentimentPrompt',
  input: {schema: AnalyzeSentimentInputSchema},
  output: {schema: AnalyzeSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following text and classify it as positive, negative, or neutral.
Focus on the overall emotional tone of the message. If the text contains mixed emotions but has a generally negative or complaining tone, classify it as negative. If it's generally positive or hopeful, classify it as positive. Use neutral for objective statements or questions without strong emotional content.

Text: {{{text}}}

Return only the classification.`,
});

const analyzeSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSentimentFlow',
    inputSchema: AnalyzeSentimentInputSchema,
    outputSchema: AnalyzeSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
