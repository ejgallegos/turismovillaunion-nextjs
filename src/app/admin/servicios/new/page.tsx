
import { getLocalidades } from '@/lib/localidades.service';
import { ServicioForm } from '../servicio-form';

export default async function NewServicioPage() {
  const localidades = await getLocalidades();
  return (
    <div>
      <ServicioForm localidades={localidades} />
    </div>
  );
}
