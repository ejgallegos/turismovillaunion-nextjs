'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getMapas, saveMapas, Mapa } from '@/lib/mapas.service';
import { randomUUID } from 'crypto';

const mapaSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  downloadUrl: z.string().url('La URL de descarga no es válida.').optional().or(z.literal('')),
});

export async function upsertMapa(data: unknown) {
  const validatedFields = mapaSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const mapas = await getMapas();
  const { id, ...mapaData } = validatedFields.data;
  
  try {
    if (id) {
      // Update
      const index = mapas.findIndex((m) => m.id === id);
      if (index !== -1) {
        mapas[index] = { ...mapas[index], ...mapaData, id };
      } else {
        return { success: false, error: 'Mapa no encontrado.' };
      }
    } else {
      // Create
      const newId = mapaData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = mapas.find(m => m.id === newId);
      const newMapa: Mapa = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        ...mapaData,
      };
      mapas.push(newMapa);
    }
  
    await saveMapas(mapas);
    revalidatePath('/admin/mapas');
    revalidatePath('/mapas');
  
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Error al guardar los datos.' };
  }
}

export async function deleteMapa(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const mapas = await getMapas();
      const updatedMapas = mapas.filter((m) => m.id !== id);
  
      if(mapas.length === updatedMapas.length) {
          return { success: false, error: 'Mapa no encontrado.' };
      }
  
      await saveMapas(updatedMapas);
      revalidatePath('/admin/mapas');
      revalidatePath('/mapas');
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el mapa.' };
    }
}
