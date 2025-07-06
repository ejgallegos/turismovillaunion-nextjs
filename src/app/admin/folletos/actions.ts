
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getFolletos, saveFolletos, Folleto } from '@/lib/folletos.service';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { redirect } from 'next/navigation';

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_DOWNLOAD_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const folletoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(1, 'La descripción es requerida.'),
  downloadFile: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es 10MB.`)
    .refine((file) => !file || ACCEPTED_DOWNLOAD_TYPES.includes(file.type), 'Solo se aceptan PDF, JPG, PNG y WebP.')
    .optional(),
});

export async function upsertFolleto(formData: FormData) {
  const rawData = {
    id: formData.get('id')?.toString(),
    title: formData.get('title')?.toString(),
    description: formData.get('description')?.toString(),
    downloadFile: formData.get('downloadFile') as File | null,
  };

  // Filter out empty files so validation passes if no file is uploaded
  if (rawData.downloadFile && rawData.downloadFile.size === 0) {
    rawData.downloadFile = null;
  }

  const validatedFields = folletoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, title, description, downloadFile } = validatedFields.data;
  const folletos = await getFolletos();
  const existingFolleto = id ? folletos.find((f) => f.id === id) : undefined;
  
  let downloadUrl: string | undefined = existingFolleto?.downloadUrl;

  try {
    const slug = slugify(title);
    const uploadDir = path.join(process.cwd(), 'public/uploads/folletos', slug);
    
    // Create directory if we are uploading any file
    if (downloadFile) {
        await fs.mkdir(uploadDir, { recursive: true });
    }
    
    // Handle downloadable file upload
    if (downloadFile) {
      const fileExtension = path.extname(downloadFile.name);
      const filename = `download-${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await downloadFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      downloadUrl = `/uploads/folletos/${slug}/${filename}`;
    }

    if (id) {
      // Update
      const index = folletos.findIndex((f) => f.id === id);
      if (index !== -1) {
        folletos[index] = { 
          ...folletos[index], 
          title, 
          description,
          downloadUrl, // Updated or existing
        };
      } else {
        return { success: false, error: 'Folleto no encontrado.' };
      }
    } else {
      // Create
      if (!downloadUrl) {
        return { success: false, errors: { downloadFile: ['El archivo es requerido.'] } };
      }
      const newId = slugify(title);
      const existing = folletos.find(f => f.id === newId);
      const newFolleto: Folleto = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        title,
        description,
        downloadUrl,
      };
      folletos.push(newFolleto);
    }
  
    await saveFolletos(folletos);
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Error al guardar los datos.' };
  }

  revalidatePath('/admin/folletos');
  revalidatePath('/folletos');
  redirect('/admin/folletos');
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
      
      // Delete the folder associated with the folleto
      if (folletoToDelete.downloadUrl) {
        try {
          const fileDir = path.join(process.cwd(), 'public', path.dirname(folletoToDelete.downloadUrl));
          await fs.rm(fileDir, { recursive: true, force: true });
        } catch (error) {
            console.error(`Failed to delete directory for folleto ${id}:`, error);
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
