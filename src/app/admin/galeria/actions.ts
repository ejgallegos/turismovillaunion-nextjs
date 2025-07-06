

'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getGalleryItems, saveGalleryItems, GalleryItem } from '@/lib/galeria.service';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { redirect } from 'next/navigation';

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const galleryItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().optional(),
  image: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es 10MB.`)
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), 'Solo se aceptan .jpg, .png y .webp.')
    .optional(),
});

export async function upsertGalleryItem(formData: FormData) {
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
  
  const validatedFields = galleryItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, title, description } = validatedFields.data;
  const image = validatedFields.data.image;
  const galleryItems = await getGalleryItems();
  const existingItem = id ? galleryItems.find((i) => i.id === id) : undefined;
  let imageUrl: string | undefined = existingItem?.imageUrl;

  try {
    // Handle file upload if an image is provided
    if (image) {
      const slug = slugify(title);
      const uploadDir = path.join(process.cwd(), 'public/uploads/galeria', slug);
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(image.name);
      const filename = `${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/galeria/${slug}/${filename}`;
    }

    if (id) {
      // Update
      const index = galleryItems.findIndex((a) => a.id === id);
      if (index !== -1) {
        galleryItems[index] = { 
          ...galleryItems[index], 
          title, 
          description: description || '',
          imageUrl: imageUrl!,
        };
      } else {
        return { success: false, error: 'Elemento de galería no encontrado.' };
      }
    } else {
      // Create
      if (!imageUrl) {
        return { success: false, errors: { image: ['La imagen es requerida.'] } };
      }
      const newId = slugify(title);
      const existing = galleryItems.find(a => a.id === newId);
      const newItem: GalleryItem = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        title,
        description: description || '',
        imageUrl,
      };
      galleryItems.push(newItem);
    }
  
    await saveGalleryItems(galleryItems);
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Error al guardar los datos.' };
  }
  
  revalidatePath('/admin/galeria');
  revalidatePath('/galeria');
  redirect('/admin/galeria');
}

export async function deleteGalleryItem(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const galleryItems = await getGalleryItems();
      const itemToDelete = galleryItems.find((a) => a.id === id);

      if (!itemToDelete) {
        return { success: false, error: 'Elemento de galería no encontrado.' };
      }

      const updatedItems = galleryItems.filter((a) => a.id !== id);
      
      if (itemToDelete.imageUrl) {
        try {
          const imageDir = path.join(process.cwd(), 'public', path.dirname(itemToDelete.imageUrl));
          await fs.rm(imageDir, { recursive: true, force: true });
        } catch (error) {
            console.error(`Failed to delete image directory for gallery item ${id}:`, error);
        }
      }
  
      await saveGalleryItems(updatedItems);
      revalidatePath('/admin/galeria');
      revalidatePath('/galeria');
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el elemento.' };
    }
}
