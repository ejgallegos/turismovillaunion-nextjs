// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A flow to generate SEO-optimized title and meta description tags for a landmark page based on current tourist interests.
 *
 * - generateMetaTags - A function that generates SEO-optimized title and meta description tags.
 * - GenerateMetaTagsInput - The input type for the generateMetaTags function.
 * - GenerateMetaTagsOutput - The return type for the generateMetaTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPopularityInputSchema = z.object({
  landmarkName: z.string().describe('The name of the landmark.'),
});

const GenerateMetaTagsInputSchema = z.object({
  landmarkName: z.string().describe('The name of the landmark.'),
  currentDate: z.string().describe('The current date.'),
});

export type GenerateMetaTagsInput = z.infer<typeof GenerateMetaTagsInputSchema>;

const GenerateMetaTagsOutputSchema = z.object({
  title: z.string().describe('The SEO-optimized title tag for the landmark page.'),
  metaDescription: z.string().describe('The SEO-optimized meta description tag for the landmark page.'),
});

export type GenerateMetaTagsOutput = z.infer<typeof GenerateMetaTagsOutputSchema>;

async function getPopularity(input: GetPopularityInputSchema): Promise<number> {
  // In a real implementation, this would call an external service or database
  // to get the popularity score of the landmark.
  // For this example, we'll just return a random number between 0 and 100.
  return Math.floor(Math.random() * 100);
}

const getPopularityTool = ai.defineTool({
  name: 'getPopularity',
  description: 'Returns the current popularity score of a landmark.',
  inputSchema: GetPopularityInputSchema,
  outputSchema: z.number(),
}, async (input) => {
  return getPopularity(input);
});

export async function generateMetaTags(input: GenerateMetaTagsInput): Promise<GenerateMetaTagsOutput> {
  return generateMetaTagsFlow(input);
}

const generateMetaTagsPrompt = ai.definePrompt({
  name: 'generateMetaTagsPrompt',
  input: {schema: GenerateMetaTagsInputSchema},
  output: {schema: GenerateMetaTagsOutputSchema},
  tools: [getPopularityTool],
  system: `You are an SEO expert specializing in generating title and meta description tags for landmark pages.

  Instructions:
  1. Use getPopularity tool to obtain popularity of a landmark.
  2. Generate a concise, engaging, and SEO-friendly title tag (maximum 60 characters).
  3. Craft a compelling meta description (maximum 160 characters) that highlights the landmark's unique attractions and encourages visits.
  4. Incorporate relevant keywords based on current tourist interests and the landmark's popularity.
  5. Always include the landmark's name in both the title and meta description.
  6. Format the output as a JSON object with "title" and "metaDescription" fields.
  7. Use the current date to make a reference to the current year in the description.

  Example:
  Landmark Name: Talampaya Canyon
  Title: Explore Talampaya Canyon: A Visitor's Guide
  Meta Description: Discover the wonders of Talampaya Canyon in {{{{currentDate}}}}. Explore towering red cliffs, ancient petroglyphs, and unique wildlife. Plan your visit today!`,
  prompt: `Landmark Name: {{{landmarkName}}}
Current Date: {{{currentDate}}}

  Title:
  Meta Description: `,
});

const generateMetaTagsFlow = ai.defineFlow(
  {
    name: 'generateMetaTagsFlow',
    inputSchema: GenerateMetaTagsInputSchema,
    outputSchema: GenerateMetaTagsOutputSchema,
  },
  async input => {
    const {output} = await generateMetaTagsPrompt(input);
    return output!;
  }
);
