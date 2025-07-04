
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getServicios, saveServicios, Servicio } from '@/lib/servicios.service';
import { randomUUID } from 'crypto';
import { redirect } from 'next/navigation';

const servicioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  icon: z.string().min(2, 'El ícono es requerido (ej: BedDouble).'),
});

export async function upsertServicio(data: unknown) {
  const validatedFields = servicioSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const servicios = await getServicios();
  const { id, ...servicioData } = validatedFields.data;
  let finalId = id;
  
  try {
    if (id) {
      // Update
      const index = servicios.findIndex((s) => s.id === id);
      if (index !== -1) {
        servicios[index] = { ...servicios[index], ...servicioData, id };
      } else {
        return { success: false, error: 'Servicio no encontrado.' };
      }
    } else {
      // Create
      const newId = servicioData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = servicios.find(s => s.id === newId);
      const newServicio: Servicio = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        ...servicioData,
      };
      servicios.push(newServicio);
      finalId = newServicio.id;
    }
  
    await saveServicios(servicios);
  } catch (e) {
    return { success: false, error: 'Error al guardar los datos.' };
  }

  revalidatePath('/admin/servicios');
  revalidatePath('/servicios');
  if (finalId) {
    revalidatePath(`/servicios/${finalId}`);
  }
  
  redirect('/admin/servicios');
}

export async function deleteServicio(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const servicios = await getServicios();
      const updatedServicios = servicios.filter((s) => s.id !== id);
  
      if(servicios.length === updatedServicios.length) {
          return { success: false, error: 'Servicio no encontrado.' };
      }
  
      await saveServicios(updatedServicios);
      revalidatePath('/admin/servicios');
      revalidatePath('/servicios');
      revalidatePath(`/servicios/${id}`);
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el servicio.' };
    }
}
