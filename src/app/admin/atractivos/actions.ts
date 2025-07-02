'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAttractions, saveAttractions, Attraction } from '@/lib/atractivos.service';
import { randomUUID } from 'crypto';

const attractionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  imageUrl: z.string().url('La URL de la imagen no es válida.'),
});

export async function upsertAttraction(data: unknown) {
  const validatedFields = attractionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const attractions = await getAttractions();
  const { id, ...attractionData } = validatedFields.data;
  
  try {
    if (id) {
      // Update
      const index = attractions.findIndex((a) => a.id === id);
      if (index !== -1) {
        attractions[index] = { ...attractions[index], ...attractionData };
      } else {
        return { success: false, error: 'Atractivo no encontrado.' };
      }
    } else {
      // Create
      const newId = attractionData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = attractions.find(a => a.id === newId);
      const newAttraction: Attraction = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        ...attractionData,
      };
      attractions.push(newAttraction);
    }
  
    await saveAttractions(attractions);
    revalidatePath('/admin/atractivos');
    revalidatePath('/atractivos');
    revalidatePath('/');
  
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Error al guardar los datos.' };
  }
}

export async function deleteAttraction(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const attractions = await getAttractions();
      const updatedAttractions = attractions.filter((a) => a.id !== id);
  
      if(attractions.length === updatedAttractions.length) {
          return { success: false, error: 'Atractivo no encontrado.' };
      }
  
      await saveAttractions(updatedAttractions);
      revalidatePath('/admin/atractivos');
      revalidatePath('/atractivos');
      revalidatePath('/');
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el atractivo.' };
    }
}
