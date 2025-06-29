'use server';

import { generateMetaTags } from '@/ai/flows/generate-meta-tags';
import { z } from 'zod';

const landmarkSchema = z.enum(['Talampaya', 'Laguna Brava', 'Cuesta de Miranda']);

export async function handleGenerateMetaTags(prevState: any, formData: FormData) {
  try {
    const landmarkName = formData.get('landmarkName');
    const validatedLandmark = landmarkSchema.safeParse(landmarkName);
    
    if (!validatedLandmark.success) {
      return { message: 'Invalid landmark selected.', data: null };
    }

    const result = await generateMetaTags({
      landmarkName: validatedLandmark.data,
      currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
    });

    return {
      message: 'Successfully generated meta tags.',
      data: result,
    };
  } catch (error) {
    console.error('Error generating meta tags:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      data: null,
    };
  }
}
