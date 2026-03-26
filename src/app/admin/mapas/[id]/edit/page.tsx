
import { getMapas } from '@/lib/mapas.service';
import { notFound } from 'next/navigation';
import { MapaForm } from '../../mapa-form';

export default async function EditMapaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mapas = await getMapas();
  const mapa = mapas.find(m => m.id === id);

  if (!mapa) {
    notFound();
  }

  return (
    <div>
      <MapaForm mapa={mapa} />
    </div>
  );
}
