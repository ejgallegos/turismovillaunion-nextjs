
import { getServicios } from '@/lib/servicios.service';
import { getLocalidades } from '@/lib/localidades.service';
import { notFound } from 'next/navigation';
import { ServicioForm } from '../../servicio-form';

export default async function EditServicioPage({ params }: { params: { id: string } }) {
  const [servicios, localidades] = await Promise.all([
      getServicios(),
      getLocalidades()
  ]);
  const servicio = servicios.find(s => s.id === params.id);

  if (!servicio) {
    notFound();
  }

  return (
    <div>
      <ServicioForm servicio={servicio} localidades={localidades} />
    </div>
  );
}
