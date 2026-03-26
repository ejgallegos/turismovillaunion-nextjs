
import { getNovedades } from '@/lib/novedades.service';
import { notFound } from 'next/navigation';
import { NovedadForm } from '../../novedad-form';

export default async function EditNovedadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const novedades = await getNovedades();
  const novedad = novedades.find(n => n.id === id);

  if (!novedad) {
    notFound();
  }

  return (
    <div>
      <NovedadForm novedad={novedad} />
    </div>
  );
}
