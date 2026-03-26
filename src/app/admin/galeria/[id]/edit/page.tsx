
import { getGalleryItems } from '@/lib/galeria.service';
import { notFound } from 'next/navigation';
import { GaleriaForm } from '../../galeria-form';

export default async function EditGaleriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await getGalleryItems();
  const item = items.find(i => i.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <GaleriaForm galleryItem={item} />
    </div>
  );
}
