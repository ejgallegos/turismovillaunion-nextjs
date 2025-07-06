import fs from 'fs/promises';
import path from 'path';
import galleryItems from '../../data/galeria.json';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'data/galeria.json');

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return galleryItems;
}

export async function saveGalleryItems(items: GalleryItem[]): Promise<void> {
  try {
    const data = JSON.stringify(items, null, 2);
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving gallery data:', error);
    throw new Error('No se pudieron guardar los elementos de la galería.');
  }
}
