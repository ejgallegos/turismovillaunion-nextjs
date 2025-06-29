// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview Un flujo para generar etiquetas de título y meta descripción optimizadas para SEO para una página de un lugar de interés, basadas en los intereses turísticos actuales.
 *
 * - generateMetaTags - Una función que genera etiquetas de título y meta descripción optimizadas para SEO.
 * - GenerateMetaTagsInput - El tipo de entrada para la función generateMetaTags.
 * - GenerateMetaTagsOutput - El tipo de retorno para la función generateMetaTags.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPopularityInputSchema = z.object({
  landmarkName: z.string().describe('El nombre del lugar de interés.'),
});

const GenerateMetaTagsInputSchema = z.object({
  landmarkName: z.string().describe('El nombre del lugar de interés.'),
  currentDate: z.string().describe('La fecha actual.'),
});

export type GenerateMetaTagsInput = z.infer<typeof GenerateMetaTagsInputSchema>;

const GenerateMetaTagsOutputSchema = z.object({
  title: z.string().describe('La etiqueta de título optimizada para SEO para la página del lugar de interés.'),
  metaDescription: z.string().describe('La etiqueta de meta descripción optimizada para SEO para la página del lugar de interés.'),
});

export type GenerateMetaTagsOutput = z.infer<typeof GenerateMetaTagsOutputSchema>;

async function getPopularity(input: GetPopularityInputSchema): Promise<number> {
  // En una implementación real, esto llamaría a un servicio externo o base de datos
  // para obtener el puntaje de popularidad del lugar de interés.
  // Para este ejemplo, simplemente devolveremos un número aleatorio entre 0 y 100.
  return Math.floor(Math.random() * 100);
}

const getPopularityTool = ai.defineTool({
  name: 'getPopularity',
  description: 'Devuelve el puntaje de popularidad actual de un lugar de interés.',
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
  system: `Eres un experto en SEO especializado en generar etiquetas de título y meta descripción para páginas de lugares de interés.

  Instrucciones:
  1. Usa la herramienta getPopularity para obtener la popularidad de un lugar de interés.
  2. Genera una etiqueta de título concisa, atractiva y amigable para SEO (máximo 60 caracteres).
  3. Crea una meta descripción atractiva (máximo 160 caracteres) que resalte las atracciones únicas del lugar y fomente las visitas.
  4. Incorpora palabras clave relevantes basadas en los intereses turísticos actuales y la popularidad del lugar.
  5. Incluye siempre el nombre del lugar de interés tanto en el título como en la meta descripción.
  6. Formatea la salida como un objeto JSON con los campos "title" y "metaDescription".
  7. Usa la fecha actual para hacer referencia al año actual en la descripción.

  Ejemplo:
  Nombre del Lugar de Interés: Cañón de Talampaya
  Título: Explora el Cañón de Talampaya: Guía del Visitante
  Meta Descripción: Descubre las maravillas del Cañón de Talampaya en {{{{currentDate}}}}. Explora imponentes acantilados rojos, petroglifos antiguos y vida silvestre única. ¡Planifica tu visita hoy!`,
  prompt: `Nombre del Lugar de Interés: {{{landmarkName}}}
Fecha Actual: {{{currentDate}}}

  Título:
  Meta Descripción: `,
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
