
import { getServicios } from '@/lib/servicios.service';
import { getLocalidades } from '@/lib/localidades.service';
import { notFound } from 'next/navigation';
import { ServicioForm } from '../../servicio-form';

export default async function EditServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [servicios, localidades] = await Promise.all([
      getServicios(),
      getLocalidades()
  ]);
  const servicio = servicios.find(s => s.id === id);

  if (!servicio) {
    notFound();
  }

  return (
    <div>
      <ServicioForm servicio={servicio} localidades={localidades} />
    </div>
  );
}
