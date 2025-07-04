
import { getGalleryItems } from '@/lib/galeria.service';
import { notFound } from 'next/navigation';
import { GaleriaForm } from '../../galeria-form';

export default async function EditGaleriaPage({ params }: { params: { id: string } }) {
  const items = await getGalleryItems();
  const item = items.find(i => i.id === params.id);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <GaleriaForm galleryItem={item} />
    </div>
  );
}
