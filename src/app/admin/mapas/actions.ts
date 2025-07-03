'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getMapas, saveMapas, Mapa } from '@/lib/mapas.service';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_DOWNLOAD_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const mapaSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  downloadFile: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es 10MB.`)
    .refine((file) => !file || ACCEPTED_DOWNLOAD_TYPES.includes(file.type), 'Solo se aceptan PDF, JPG, PNG y WebP.')
    .optional(),
});

export async function upsertMapa(formData: FormData) {
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

  const validatedFields = mapaSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, title, description, downloadFile } = validatedFields.data;
  const mapas = await getMapas();
  const existingMapa = id ? mapas.find((m) => m.id === id) : undefined;
  
  let downloadUrl: string | undefined = existingMapa?.downloadUrl;

  try {
    const slug = slugify(title);
    const uploadDir = path.join(process.cwd(), 'public/uploads/mapas', slug);

    // Create directory if we are uploading a file
    if (downloadFile) {
        await fs.mkdir(uploadDir, { recursive: true });
    }
    
    // Handle downloadable file upload
    if (downloadFile) {
      const fileExtension = path.extname(downloadFile.name);
      const filename = `mapa-${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await downloadFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      downloadUrl = `/uploads/mapas/${slug}/${filename}`;
    }

    if (id) {
      // Update
      const index = mapas.findIndex((m) => m.id === id);
      if (index !== -1) {
        mapas[index] = { 
          ...mapas[index], 
          title, 
          description,
          downloadUrl, // Updated or existing
        };
      } else {
        return { success: false, error: 'Mapa no encontrado.' };
      }
    } else {
      // Create
      const newId = slugify(title);
      const existing = mapas.find(m => m.id === newId);
      const newMapa: Mapa = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        title,
        description,
        downloadUrl,
      };
      mapas.push(newMapa);
    }
  
    await saveMapas(mapas);
    revalidatePath('/admin/mapas');
    revalidatePath('/mapas');
  
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Error al guardar los datos.' };
  }
}

export async function deleteMapa(id: string) {
    if (!id) {
        return { success: false, error: 'ID es requerido.' };
    }
    try {
      const mapas = await getMapas();
      const mapaToDelete = mapas.find((m) => m.id === id);
      
      if (!mapaToDelete) {
          return { success: false, error: 'Mapa no encontrado.' };
      }

      const updatedMapas = mapas.filter((m) => m.id !== id);
      
      // Delete the folder associated with the mapa
      if (mapaToDelete.downloadUrl) {
        try {
          const fileDir = path.join(process.cwd(), 'public', path.dirname(mapaToDelete.downloadUrl));
          await fs.rm(fileDir, { recursive: true, force: true });
        } catch (error) {
            console.error(`Failed to delete directory for mapa ${id}:`, error);
            // Non-fatal, continue with deleting the record
        }
      }
  
      await saveMapas(updatedMapas);
      revalidatePath('/admin/mapas');
      revalidatePath('/mapas');
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el mapa.' };
    }
}
