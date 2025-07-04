
import { getNovedades } from '@/lib/novedades.service';
import { notFound } from 'next/navigation';
import { NovedadForm } from '../../novedad-form';

export default async function EditNovedadPage({ params }: { params: { id: string } }) {
  const novedades = await getNovedades();
  const novedad = novedades.find(n => n.id === params.id);

  if (!novedad) {
    notFound();
  }

  return (
    <div>
      <NovedadForm novedad={novedad} />
    </div>
  );
}
