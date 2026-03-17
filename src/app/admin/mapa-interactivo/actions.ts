'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const lugarSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, 'El nombre es requerido.'),
  categoria: z.string().min(1, 'La categoría es requerida.'),
  descripcion: z.string().min(1, 'La descripción es requerida.'),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  imagen: z.string().optional(),
  imagenFile: z.any().optional(),
  latitud: z.coerce.number(),
  longitud: z.coerce.number(),
  activo: z.coerce.boolean(),
});

const tipSchema = z.object({
  id: z.string().optional(),
  texto: z.string().min(1, 'El texto es requerido.'),
  activo: z.coerce.boolean(),
});

const colectivoSchema = z.object({
  id: z.string().optional(),
  origen: z.string().min(1, 'El origen es requerido.'),
  horaSalida: z.string().min(1, 'La hora de salida es requerida.'),
  horaLlegada: z.string().min(1, 'La hora de llegada es requerida.'),
  frecuencia: z.string().min(1, 'La frecuencia es requerida.'),
  activo: z.coerce.boolean(),
});

const DATA_FILE = path.join(process.cwd(), 'data', 'mapa-interactivo.json');

async function readDataFile() {
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(content);
}

async function writeDataFile(data: unknown) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function upsertLugar(formData: FormData) {
  const rawData = {
    id: formData.get('id')?.toString() || undefined,
    nombre: formData.get('nombre')?.toString(),
    categoria: formData.get('categoria')?.toString(),
    descripcion: formData.get('descripcion')?.toString(),
    direccion: formData.get('direccion')?.toString() || undefined,
    telefono: formData.get('telefono')?.toString() || undefined,
    imagen: formData.get('imagen')?.toString(),
    imagenFile: formData.get('imagenFile') as File | null,
    latitud: formData.get('latitud')?.toString(),
    longitud: formData.get('longitud')?.toString(),
    activo: formData.get('activo')?.toString(),
  };

  // Filter out empty image file
  if (rawData.imagenFile && rawData.imagenFile instanceof File && rawData.imagenFile.size === 0) {
    rawData.imagenFile = null;
  }

  const validated = lugarSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const { id, nombre, imagenFile, ...data } = validated.data;
  const allData = await readDataFile();
  
  // Find existing lugar to get current image URL
  const existingLugar = id ? allData.lugares.find((l: { id: string }) => l.id === id) : undefined;
  let imagenUrl = validated.data.imagen || existingLugar?.imagen;

  // Handle image upload
  if (imagenFile && imagenFile instanceof File) {
    const slug = slugify(nombre || 'lugar');
    const uploadDir = path.join(process.cwd(), 'public/uploads/mapa-interactivo', slug);
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExtension = path.extname(imagenFile.name);
    const filename = `${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await imagenFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    imagenUrl = `/uploads/mapa-interactivo/${slug}/${filename}`;
  }

  const lugar = { id: id || randomUUID().slice(0, 8), ...data, imagen: imagenUrl || '' };
  
  const index = allData.lugares.findIndex((l: { id: string }) => l.id === lugar.id);
  if (index >= 0) {
    allData.lugares[index] = lugar;
  } else {
    allData.lugares.push(lugar);
  }

  await writeDataFile(allData);
  revalidatePath('/admin/mapa-interactivo');
  
  return { success: true, data: lugar };
}

export async function deleteLugar(id: string) {
  if (!id) {
    return { success: false, error: 'ID es requerido.' };
  }

  try {
    const allData = await readDataFile();
    allData.lugares = allData.lugares.filter((l: { id: string }) => l.id !== id);
    await writeDataFile(allData);
    revalidatePath('/admin/mapa-interactivo');
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Error al eliminar el lugar.' };
  }
}

export async function upsertTip(formData: FormData) {
  const rawData = {
    id: formData.get('id')?.toString() || undefined,
    texto: formData.get('texto')?.toString(),
    activo: formData.get('activo')?.toString(),
  };

  const validated = tipSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const { id, ...data } = validated.data;
  const allData = await readDataFile();
  
  const tip = { id: id || randomUUID().slice(0, 8), ...data };
  
  const index = allData.tips.findIndex((t: { id: string }) => t.id === tip.id);
  if (index >= 0) {
    allData.tips[index] = tip;
  } else {
    allData.tips.push(tip);
  }

  await writeDataFile(allData);
  revalidatePath('/admin/mapa-interactivo');
  
  return { success: true, data: tip };
}

export async function deleteTip(id: string) {
  if (!id) {
    return { success: false, error: 'ID es requerido.' };
  }

  try {
    const allData = await readDataFile();
    allData.tips = allData.tips.filter((t: { id: string }) => t.id !== id);
    await writeDataFile(allData);
    revalidatePath('/admin/mapa-interactivo');
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Error al eliminar el tip.' };
  }
}

export async function upsertColectivo(formData: FormData) {
  const rawData = {
    id: formData.get('id')?.toString() || undefined,
    origen: formData.get('origen')?.toString(),
    horaSalida: formData.get('horaSalida')?.toString(),
    horaLlegada: formData.get('horaLlegada')?.toString(),
    frecuencia: formData.get('frecuencia')?.toString(),
    activo: formData.get('activo')?.toString(),
  };

  const validated = colectivoSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const { id, ...data } = validated.data;
  const allData = await readDataFile();
  
  const colectivo = { id: id || randomUUID().slice(0, 8), ...data };
  
  const index = allData.colectivos.findIndex((c: { id: string }) => c.id === colectivo.id);
  if (index >= 0) {
    allData.colectivos[index] = colectivo;
  } else {
    allData.colectivos.push(colectivo);
  }

  await writeDataFile(allData);
  revalidatePath('/admin/mapa-interactivo');
  
  return { success: true, data: colectivo };
}

export async function deleteColectivo(id: string) {
  if (!id) {
    return { success: false, error: 'ID es requerido.' };
  }

  try {
    const allData = await readDataFile();
    allData.colectivos = allData.colectivos.filter((c: { id: string }) => c.id !== id);
    await writeDataFile(allData);
    revalidatePath('/admin/mapa-interactivo');
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Error al eliminar el colectivo.' };
  }
}
