
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getServicios, saveServicios, Servicio } from '@/lib/servicios.service';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { redirect } from 'next/navigation';

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_DOWNLOAD_TYPES = ['application/pdf'];

const servicioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido.'),
  localidadId: z.string().min(1, 'La localidad es requerida.'),
  downloadFile: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es 10MB.`)
    .refine((file) => !file || ACCEPTED_DOWNLOAD_TYPES.includes(file.type), 'Solo se aceptan archivos PDF.')
    .optional(),
});

export async function upsertServicio(formData: FormData) {
  const rawData = {
    id: formData.get('id')?.toString(),
    title: formData.get('title')?.toString(),
    localidadId: formData.get('localidadId')?.toString(),
    downloadFile: formData.get('downloadFile') as File | null,
  };

  if (rawData.downloadFile && rawData.downloadFile.size === 0) {
    rawData.downloadFile = null;
  }

  const validatedFields = servicioSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, title, localidadId, downloadFile } = validatedFields.data;
  const servicios = await getServicios();
  const existingServicio = id ? servicios.find((s) => s.id === id) : undefined;
  let downloadUrl: string | undefined = existingServicio?.downloadUrl;
  let finalId = id;
  
  try {
    if (downloadFile) {
      const slug = slugify(title);
      const uploadDir = path.join(process.cwd(), 'public/uploads/servicios', slug);
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(downloadFile.name);
      const filename = `${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await downloadFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      downloadUrl = `/uploads/servicios/${slug}/${filename}`;
    }

    if (id) {
      // Update
      const index = servicios.findIndex((s) => s.id === id);
      if (index !== -1) {
        servicios[index] = { ...servicios[index], title, localidadId, downloadUrl: downloadUrl! };
      } else {
        return { success: false, error: 'Servicio no encontrado.' };
      }
    } else {
      // Create
      if (!downloadUrl) {
        return { success: false, errors: { downloadFile: ['El archivo PDF es requerido.'] } };
      }
      const newId = slugify(title);
      const existing = servicios.find(s => s.id === newId);
      const newServicio: Servicio = {
        id: existing ? `${newId}-${randomUUID().slice(0, 4)}` : newId,
        title,
        localidadId,
        downloadUrl,
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
      const servicioToDelete = servicios.find((s) => s.id === id);
      const updatedServicios = servicios.filter((s) => s.id !== id);
  
      if(servicios.length === updatedServicios.length) {
          return { success: false, error: 'Servicio no encontrado.' };
      }

      if (servicioToDelete?.downloadUrl) {
        try {
          const fileDir = path.join(process.cwd(), 'public', path.dirname(servicioToDelete.downloadUrl));
          await fs.rm(fileDir, { recursive: true, force: true });
        } catch (error) {
            console.error(`Failed to delete directory for servicio ${id}:`, error);
        }
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
