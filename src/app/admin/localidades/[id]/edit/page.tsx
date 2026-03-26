
import { getLocalidades } from '@/lib/localidades.service';
import { notFound } from 'next/navigation';
import { LocalidadForm } from '../../localidad-form';

export default async function EditLocalidadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const localidades = await getLocalidades();
  const localidad = localidades.find(l => l.id === id);

  if (!localidad) {
    notFound();
  }

  return (
    <div>
      <LocalidadForm localidad={localidad} />
    </div>
  );
}
