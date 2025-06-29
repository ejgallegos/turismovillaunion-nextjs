'use server';

import { generateMetaTags } from '@/ai/flows/generate-meta-tags';
import { z } from 'zod';

const landmarkSchema = z.enum(['Talampaya', 'Laguna Brava', 'Cuesta de Miranda']);

export async function handleGenerateMetaTags(prevState: any, formData: FormData) {
  try {
    const landmarkName = formData.get('landmarkName');
    const validatedLandmark = landmarkSchema.safeParse(landmarkName);
    
    if (!validatedLandmark.success) {
      return { message: 'Lugar de interés inválido seleccionado.', data: null };
    }

    const result = await generateMetaTags({
      landmarkName: validatedLandmark.data,
      currentDate: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
    });

    return {
      message: 'Metaetiquetas generadas con éxito.',
      data: result,
    };
  } catch (error) {
    console.error('Error generating meta tags:', error);
    return {
      message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
      data: null,
    };
  }
}
