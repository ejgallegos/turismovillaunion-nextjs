
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getLocalidades, saveLocalidades, Localidad } from '@/lib/localidades.service';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { redirect } from 'next/navigation';

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const localidadSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(1, 'La descripción es requerida.'),
  image: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es 10MB.`)
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), 'Solo se aceptan .jpg, .png y .webp.')
    .optional(),
});

export async function upsertLocalidad(formData: FormData) {
  const rawData = {
    id: formData.get('id')?.toString(),
    title: formData.get('title')?.toString(),
    description: formData.get('description')?.toString(),
    image: formData.get('image') as File | null,
  };
  
  if (rawData.image && rawData.image.size === 0) {
    rawData.image = null;
  }
  
  const validatedFields = localidadSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, title, description, image } = validatedFields.data;
  const localidades = await getLocalidades();
  let imageUrl: string | undefined = undefined;
  let finalId = id;

  try {
    if (image) {
      const slug = slugify(title);
      const uploadDir = path.join(process.cwd(), 'public/uploads/localidades', slug);
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(image.name);
      const filename = `${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/localidades/${slug}/${filename}`;
    }

    if (id) {
      const index = localidades.findIndex((a) => a.id === id);
      if (index !== -1) {
        localidades[index] = { 
          ...localidades[index], 
          title, 
          description,
          ...(imageUrl && { imageUrl }),
        };
      } else {
        return { success: false, error: 'Localidad no encontrada.' };
      }
    } else {
      if (!imageUrl) {
        return { success: false, errors: { image: ['La imagen es requerida.'] } };
      }
      const newId = slugify(title);
      const existing = localidades.find(a => a.id === newId);
      const newLocalidad: Localidad = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        title,
        description,
        imageUrl,
      };
      localidades.push(newLocalidad);
      finalId = newLocalidad.id;
    }
  
    await saveLocalidades(localidades);
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Error al guardar los datos.' };
  }
  
  revalidatePath('/admin/localidades');
  revalidatePath('/localidades');
  if (finalId) {
    revalidatePath(`/localidades/${finalId}`);
  }
  redirect('/admin/localidades');
}

export async function deleteLocalidad(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const localidades = await getLocalidades();
      const localidadToDelete = localidades.find((a) => a.id === id);

      if (!localidadToDelete) {
        return { success: false, error: 'Localidad no encontrada.' };
      }

      const updatedLocalidades = localidades.filter((a) => a.id !== id);
      
      if (localidadToDelete.imageUrl) {
        try {
          const imageDir = path.join(process.cwd(), 'public', path.dirname(localidadToDelete.imageUrl));
          await fs.rm(imageDir, { recursive: true, force: true });
        } catch (error) {
            console.error(`Failed to delete image directory for localidad ${id}:`, error);
        }
      }
  
      await saveLocalidades(updatedLocalidades);
      revalidatePath('/admin/localidades');
      revalidatePath('/localidades');
      revalidatePath(`/localidades/${id}`);
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar la localidad.' };
    }
}
