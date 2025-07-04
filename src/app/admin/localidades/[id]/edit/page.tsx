
import { getLocalidades } from '@/lib/localidades.service';
import { notFound } from 'next/navigation';
import { LocalidadForm } from '../../localidad-form';

export default async function EditLocalidadPage({ params }: { params: { id: string } }) {
  const localidades = await getLocalidades();
  const localidad = localidades.find(l => l.id === params.id);

  if (!localidad) {
    notFound();
  }

  return (
    <div>
      <LocalidadForm localidad={localidad} />
    </div>
  );
}
