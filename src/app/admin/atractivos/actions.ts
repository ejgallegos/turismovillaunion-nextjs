
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAttractions, saveAttractions, Attraction } from '@/lib/atractivos.service';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { redirect } from 'next/navigation';

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const attractionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(1, 'La descripción es requerida.'),
  image: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es 10MB.`)
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), 'Solo se aceptan .jpg, .png y .webp.')
    .optional(),
});

export async function upsertAttraction(formData: FormData) {
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
  
  const validatedFields = attractionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, title, description, image } = validatedFields.data;
  const attractions = await getAttractions();
  const existingAttraction = id ? attractions.find((a) => a.id === id) : undefined;
  let imageUrl: string | undefined = existingAttraction?.imageUrl;
  let finalId = id;

  try {
    // Handle file upload if an image is provided
    if (image) {
      const slug = slugify(title);
      const uploadDir = path.join(process.cwd(), 'public/uploads/atractivos', slug);
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(image.name);
      const filename = `${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/atractivos/${slug}/${filename}`;
    }

    if (id) {
      // Update
      const index = attractions.findIndex((a) => a.id === id);
      if (index !== -1) {
        attractions[index] = { 
          ...attractions[index], 
          title, 
          description,
          imageUrl: imageUrl!,
        };
      } else {
        return { success: false, error: 'Atractivo no encontrado.' };
      }
    } else {
      // Create
      if (!imageUrl) {
        return { success: false, errors: { image: ['La imagen es requerida.'] } };
      }
      const newId = slugify(title);
      const existing = attractions.find(a => a.id === newId);
      const newAttraction: Attraction = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        title,
        description,
        imageUrl,
      };
      attractions.push(newAttraction);
      finalId = newAttraction.id;
    }
  
    await saveAttractions(attractions);
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Error al guardar los datos.' };
  }

  revalidatePath('/admin/atractivos');
  revalidatePath('/atractivos');
  if (finalId) {
    revalidatePath(`/atractivos/${finalId}`);
  }

  redirect('/admin/atractivos');
}

export async function deleteAttraction(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const attractions = await getAttractions();
      const attractionToDelete = attractions.find((a) => a.id === id);

      if (!attractionToDelete) {
        return { success: false, error: 'Atractivo no encontrado.' };
      }

      const updatedAttractions = attractions.filter((a) => a.id !== id);
      
      // Delete the image folder associated with the attraction
      if (attractionToDelete.imageUrl) {
        try {
          const imageDir = path.join(process.cwd(), 'public', path.dirname(attractionToDelete.imageUrl));
          await fs.rm(imageDir, { recursive: true, force: true });
        } catch (error) {
            console.error(`Failed to delete image directory for attraction ${id}:`, error);
            // Non-fatal, continue with deleting the record
        }
      }
  
      await saveAttractions(updatedAttractions);
      revalidatePath('/admin/atractivos');
      revalidatePath('/atractivos');
      revalidatePath('/');
      revalidatePath(`/atractivos/${id}`);
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el atractivo.' };
    }
}
