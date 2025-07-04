
import { getServicios } from '@/lib/servicios.service';
import { notFound } from 'next/navigation';
import { ServicioForm } from '../../servicio-form';

export default async function EditServicioPage({ params }: { params: { id: string } }) {
  const servicios = await getServicios();
  const servicio = servicios.find(s => s.id === params.id);

  if (!servicio) {
    notFound();
  }

  return (
    <div>
      <ServicioForm servicio={servicio} />
    </div>
  );
}
