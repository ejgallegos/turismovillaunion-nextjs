'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getFolletos, saveFolletos, Folleto } from '@/lib/folletos.service';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const folletoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  downloadUrl: z.string().url('La URL de descarga no es válida.').optional().or(z.literal('')),
  image: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es 5MB.`)
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), 'Solo se aceptan .jpg, .png y .webp.')
    .optional(),
});

export async function upsertFolleto(formData: FormData) {
  const rawData = {
    id: formData.get('id')?.toString(),
    title: formData.get('title')?.toString(),
    description: formData.get('description')?.toString(),
    downloadUrl: formData.get('downloadUrl')?.toString() || '',
    image: formData.get('image') as File | null,
  };

  // Filter out empty image file so validation passes if no file is uploaded
  if (rawData.image && rawData.image.size === 0) {
    rawData.image = null;
  }

  const validatedFields = folletoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, title, description, downloadUrl, image } = validatedFields.data;
  const folletos = await getFolletos();
  let imageUrl: string | undefined = undefined;

  try {
    // Handle file upload if an image is provided
    if (image) {
      const slug = slugify(title);
      const uploadDir = path.join(process.cwd(), 'public/uploads/folletos', slug);
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(image.name);
      const filename = `${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/folletos/${slug}/${filename}`;
    }

    if (id) {
      // Update
      const index = folletos.findIndex((f) => f.id === id);
      if (index !== -1) {
        folletos[index] = { 
          ...folletos[index], 
          title, 
          description,
          downloadUrl,
          // Only update imageUrl if a new one was uploaded
          ...(imageUrl && { imageUrl }),
        };
      } else {
        return { success: false, error: 'Folleto no encontrado.' };
      }
    } else {
      // Create
      if (!imageUrl) {
        return { success: false, errors: { image: ['La imagen es requerida.'] } };
      }
      const newId = slugify(title);
      const existing = folletos.find(f => f.id === newId);
      const newFolleto: Folleto = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        title,
        description,
        imageUrl,
        downloadUrl,
      };
      folletos.push(newFolleto);
    }
  
    await saveFolletos(folletos);
    revalidatePath('/admin/folletos');
    revalidatePath('/folletos');
  
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Error al guardar los datos.' };
  }
}

export async function deleteFolleto(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const folletos = await getFolletos();
      const folletoToDelete = folletos.find((f) => f.id === id);
      
      if (!folletoToDelete) {
          return { success: false, error: 'Folleto no encontrado.' };
      }

      const updatedFolletos = folletos.filter((f) => f.id !== id);
      
      // Delete the image folder associated with the folleto
      if (folletoToDelete.imageUrl) {
        try {
          const imageDir = path.join(process.cwd(), 'public', path.dirname(folletoToDelete.imageUrl));
          await fs.rm(imageDir, { recursive: true, force: true });
        } catch (error) {
            console.error(`Failed to delete image directory for folleto ${id}:`, error);
            // Non-fatal, continue with deleting the record
        }
      }
  
      await saveFolletos(updatedFolletos);
      revalidatePath('/admin/folletos');
      revalidatePath('/folletos');
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el folleto.' };
    }
}
