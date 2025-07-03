'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getNovedades, saveNovedades, Novedad } from '@/lib/novedades.service';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const novedadSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  image: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es 10MB.`)
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), 'Solo se aceptan .jpg, .png y .webp.')
    .optional(),
});

export async function upsertNovedad(formData: FormData) {
  const rawData = {
    id: formData.get('id')?.toString(),
    title: formData.get('title')?.toString(),
    description: formData.get('description')?.toString(),
    image: formData.get('image') as File | null,
  };
  
  // Filter out empty image file so validation passes if no file is uploaded
  if (rawData.image && rawData.image.size === 0) {
    rawData.image = null;
  }
  
  const validatedFields = novedadSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, title, description, image } = validatedFields.data;
  const novedades = await getNovedades();
  const existingNovedad = id ? novedades.find((n) => n.id === id) : undefined;
  
  // Initialize with the existing image URL to prevent accidental deletion on update
  let imageUrl: string | undefined = existingNovedad?.imageUrl;

  try {
    // Handle file upload if a new image is provided
    if (image) {
      const slug = slugify(title);
      const uploadDir = path.join(process.cwd(), 'public/uploads/novedades', slug);
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(image.name);
      const filename = `${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      // Overwrite imageUrl with the new URL
      imageUrl = `/uploads/novedades/${slug}/${filename}`;
    }

    if (id) {
      // Update
      const index = novedades.findIndex((n) => n.id === id);
      if (index !== -1) {
        novedades[index] = { 
          ...novedades[index], 
          title, 
          description,
          // This must have a value, either the old one or the newly uploaded one.
          imageUrl: imageUrl!, 
        };
      } else {
        return { success: false, error: 'Novedad no encontrada.' };
      }
    } else {
      // Create
      if (!imageUrl) {
        return { success: false, errors: { image: ['La imagen es requerida.'] } };
      }
      const newId = slugify(title);
      const existing = novedades.find(n => n.id === newId);
      const newNovedad: Novedad = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        title,
        description,
        imageUrl,
      };
      novedades.push(newNovedad);
    }
  
    await saveNovedades(novedades);
    revalidatePath('/admin/novedades');
    revalidatePath('/novedades');
    revalidatePath('/');
  
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Error al guardar los datos.' };
  }
}

export async function deleteNovedad(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const novedades = await getNovedades();
      const novedadToDelete = novedades.find((n) => n.id === id);

      if (!novedadToDelete) {
        return { success: false, error: 'Novedad no encontrada.' };
      }

      const updatedNovedades = novedades.filter((n) => n.id !== id);
      
      if (novedadToDelete.imageUrl) {
        try {
          const imageDir = path.join(process.cwd(), 'public', path.dirname(novedadToDelete.imageUrl));
          await fs.rm(imageDir, { recursive: true, force: true });
        } catch (error) {
            console.error(`Failed to delete image directory for novedad ${id}:`, error);
        }
      }
  
      await saveNovedades(updatedNovedades);
      revalidatePath('/admin/novedades');
      revalidatePath('/novedades');
      revalidatePath('/');
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar la novedad.' };
    }
}
