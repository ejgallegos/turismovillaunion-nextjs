'use server';
/**
 * @fileOverview An AI flow to generate SEO meta tags for a web page.
 *
 * - generateMetaTags - A function that generates a title, description, and keywords.
 * - GenerateMetaTagsInput - The input type for the generateMetaTags function.
 * - GenerateMetaTagsOutput - The return type for the generateMetaTags function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMetaTagsInputSchema = z.object({
  content: z.string().describe('The main content or a short description of the web page.'),
});
export type GenerateMetaTagsInput = z.infer<typeof GenerateMetaTagsInputSchema>;

const GenerateMetaTagsOutputSchema = z.object({
  title: z.string().describe('A concise, SEO-friendly title for the page (max 60 characters).'),
  description: z.string().describe('A compelling meta description for the page (max 160 characters).'),
  keywords: z.string().describe('A comma-separated list of relevant keywords for the page.'),
});
export type GenerateMetaTagsOutput = z.infer<typeof GenerateMetaTagsOutputSchema>;

export async function generateMetaTags(input: GenerateMetaTagsInput): Promise<GenerateMetaTagsOutput> {
  return generateMetaTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMetaTagsPrompt',
  input: { schema: GenerateMetaTagsInputSchema },
  output: { schema: GenerateMetaTagsOutputSchema },
  prompt: `You are an SEO expert specializing in tourism for the La Rioja region of Argentina, specifically for Villa Unión and the Talampaya National Park.

Based on the following page content, generate the optimal meta tags to maximize search engine visibility and click-through rate.

The brand voice is adventurous, professional, and inviting.

Page Content:
"{{{content}}}"

Generate a title, description, and keywords according to the output schema. Ensure the title and description are within the standard character limits for SEO.`,
});

const generateMetaTagsFlow = ai.defineFlow(
  {
    name: 'generateMetaTagsFlow',
    inputSchema: GenerateMetaTagsInputSchema,
    outputSchema: GenerateMetaTagsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
