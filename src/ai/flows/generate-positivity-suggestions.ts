
'use server';
/**
 * @fileOverview Generates suggestions for a more positive mindset based on sentiment analysis.
 *
 * - generatePositivitySuggestions - A function that returns helpful tips.
 * - PositivitySuggestionsInput - The input type for the function.
 * - PositivitySuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PositivitySuggestionsInputSchema = z.object({
  positive: z.number(),
  negative: z.number(),
  neutral: z.number(),
});
export type PositivitySuggestionsInput = z.infer<typeof PositivitySuggestionsInputSchema>;

const PositivitySuggestionsOutputSchema = z.object({
  suggestions: z.string().describe('Actionable suggestions to improve mindset, formatted in Markdown.'),
});
export type PositivitySuggestionsOutput = z.infer<typeof PositivitySuggestionsOutputSchema>;

export async function generatePositivitySuggestions(input: PositivitySuggestionsInput): Promise<PositivitySuggestionsOutput> {
  return generatePositivitySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePositivitySuggestionsPrompt',
  input: {schema: PositivitySuggestionsInputSchema},
  output: {schema: PositivitySuggestionsOutputSchema},
  prompt: `You are a compassionate and encouraging AI mental wellness coach.
A user's recent chat history shows the following sentiment breakdown:
- Positive Messages: {{{positive}}}
- Negative Messages: {{{negative}}}
- Neutral Messages: {{{neutral}}}

Their Losada Ratio (Positive/Negative) is low, suggesting they might be in a "languishing" state.

Your task is to provide 2-3 brief, actionable, and encouraging suggestions to help them cultivate a more positive mindset. Frame your response as "Here are a couple of ideas to try:".
Format the output in Markdown.

Focus on simple, evidence-based techniques like:
- Gratitude practice (e.g., "Take a moment to think of one small thing that went well today.")
- Mindful observation (e.g., "Notice the details of your next meal—the colors, the smells, the textures.")
- Self-compassion (e.g., "It's okay to feel this way. Treat yourself with the same kindness you'd offer a friend.")
- A small act of kindness.

Keep the suggestions encouraging and not demanding. Do not mention the Losada Ratio or the word "languishing" to the user.`,
});

const generatePositivitySuggestionsFlow = ai.defineFlow(
  {
    name: 'generatePositivitySuggestionsFlow',
    inputSchema: PositivitySuggestionsInputSchema,
    outputSchema: PositivitySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
