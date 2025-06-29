'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getFolletos, saveFolletos, Folleto } from '@/lib/folletos.service';
import { randomUUID } from 'crypto';

const folletoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  imageUrl: z.string().url('La URL de la imagen no es válida.'),
  aiHint: z.string().min(2, 'La pista para IA es requerida.'),
  downloadUrl: z.string().url('La URL de descarga no es válida.').optional().or(z.literal('')),
});

export async function upsertFolleto(data: unknown) {
  const validatedFields = folletoSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const folletos = await getFolletos();
  const { id, ...folletoData } = validatedFields.data;
  
  try {
    if (id) {
      // Update
      const index = folletos.findIndex((f) => f.id === id);
      if (index !== -1) {
        folletos[index] = { ...folletos[index], ...folletoData, id };
      } else {
        return { success: false, error: 'Folleto no encontrado.' };
      }
    } else {
      // Create
      const newId = folletoData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = folletos.find(f => f.id === newId);
      const newFolleto: Folleto = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        ...folletoData,
      };
      folletos.push(newFolleto);
    }
  
    await saveFolletos(folletos);
    revalidatePath('/admin/folletos');
    revalidatePath('/folletos');
  
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Error al guardar los datos.' };
  }
}

export async function deleteFolleto(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const folletos = await getFolletos();
      const updatedFolletos = folletos.filter((f) => f.id !== id);
  
      if(folletos.length === updatedFolletos.length) {
          return { success: false, error: 'Folleto no encontrado.' };
      }
  
      await saveFolletos(updatedFolletos);
      revalidatePath('/admin/folletos');
      revalidatePath('/folletos');
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el folleto.' };
    }
}
