import fs from 'fs/promises';
import path from 'path';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/galeria.json');

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    if (!fileContents.trim()) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      if (process.env.NODE_ENV === 'production') {
        console.warn(`Gallery data file not found: ${dataFilePath}. This might be a deployment issue if you expect data. Returning empty array.`);
        return [];
      }
      await saveGalleryItems([]);
      return [];
    }
    console.warn(`Could not read or parse gallery data from ${dataFilePath}. Returning empty array.`, error);
    return [];
  }
}

export async function saveGalleryItems(items: GalleryItem[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    const data = JSON.stringify(items, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving gallery data:', error);
    throw new Error('No se pudieron guardar los elementos de la galería.');
  }
}
