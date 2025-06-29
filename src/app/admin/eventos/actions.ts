'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getEventos, saveEventos, Evento } from '@/lib/eventos.service';
import { randomUUID } from 'crypto';

const eventoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  date: z.string().min(1, 'La fecha es requerida.'),
  category: z.string().min(3, 'La categoría es requerida.'),
  icon: z.string().min(2, 'El ícono es requerido.'),
});

export async function upsertEvento(data: unknown) {
  const validatedFields = eventoSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const eventos = await getEventos();
  const { id, ...eventoData } = validatedFields.data;
  
  try {
    if (id) {
      // Update
      const index = eventos.findIndex((e) => e.id === id);
      if (index !== -1) {
        eventos[index] = { ...eventos[index], ...eventoData, id };
      } else {
        return { success: false, error: 'Evento no encontrado.' };
      }
    } else {
      // Create
      const newId = eventoData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = eventos.find(e => e.id === newId);
      const newEvento: Evento = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        ...eventoData,
      };
      eventos.push(newEvento);
    }
  
    await saveEventos(eventos);
    revalidatePath('/admin/eventos');
    revalidatePath('/eventos');
  
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Error al guardar los datos.' };
  }
}

export async function deleteEvento(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const eventos = await getEventos();
      const updatedEventos = eventos.filter((e) => e.id !== id);
  
      if(eventos.length === updatedEventos.length) {
          return { success: false, error: 'Evento no encontrado.' };
      }
  
      await saveEventos(updatedEventos);
      revalidatePath('/admin/eventos');
      revalidatePath('/eventos');
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el evento.' };
    }
}
