
import { getAttractions } from '@/lib/atractivos.service';
import { notFound } from 'next/navigation';
import { AtractivoForm } from '../../atractivo-form';

export default async function EditAtractivoPage({ params }: { params: { id: string } }) {
  const attractions = await getAttractions();
  const attraction = attractions.find(a => a.id === params.id);

  if (!attraction) {
    notFound();
  }

  return (
    <div>
      <AtractivoForm attraction={attraction} />
    </div>
  );
}
