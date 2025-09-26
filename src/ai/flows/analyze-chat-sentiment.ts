
'use server';
/**
 * @fileOverview Analyzes the sentiment of chat messages.
 *
 * - analyzeChatSentiment - A function that takes an array of messages and returns sentiment counts.
 * - SentimentAnalysisInput - The input type for the analyzeChatSentiment function.
 * - SentimentAnalysisOutput - The return type for the analyzeChatSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SentimentAnalysisInputSchema = z.object({
  messages: z.array(z.string()).describe('An array of chat messages to be analyzed.'),
});
export type SentimentAnalysisInput = z.infer<typeof SentimentAnalysisInputSchema>;

const SentimentAnalysisOutputSchema = z.object({
  positive: z.number().describe('The count of messages with a positive sentiment.'),
  negative: z.number().describe('The count of messages with a negative sentiment.'),
  neutral: z.number().describe('The count of messages with a neutral sentiment.'),
});
export type SentimentAnalysisOutput = z.infer<typeof SentimentAnalysisOutputSchema>;

export async function analyzeChatSentiment(input: SentimentAnalysisInput): Promise<SentimentAnalysisOutput> {
  return analyzeChatSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeChatSentimentPrompt',
  input: {schema: SentimentAnalysisInputSchema},
  output: {schema: SentimentAnalysisOutputSchema},
  prompt: `You are a sentiment analysis expert. Analyze the following list of messages from a user in a mental health app.
Classify each message as 'positive', 'negative', or 'neutral'.

Your task is to count the number of messages in each category and return the totals.
Focus on the user's expressed emotions and mindset.

Messages:
{{#each messages}}
- "{{this}}"
{{/each}}

Return only the final counts in the specified JSON format.`,
});

const analyzeChatSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeChatSentimentFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentAnalysisOutputSchema,
  },
  async input => {
    // If there are no messages, return zero counts to avoid calling the AI with no data.
    if (input.messages.length === 0) {
        return { positive: 0, negative: 0, neutral: 0 };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
