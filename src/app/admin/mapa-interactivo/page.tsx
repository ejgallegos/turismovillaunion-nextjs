import type { Metadata } from 'next';
import { getMapaInteractivoData } from '@/lib/admin-mapa.service';
import { getMapas } from '@/lib/mapas.service';
import { AdminMapaContent } from './admin-mapa-content';

export const metadata: Metadata = {
  title: 'Mapa Interactivo - Admin',
  description: 'Gestiona los datos del mapa interactivo',
};

export default async function AdminMapaInteractivoPage() {
  const [mapaData, mapas] = await Promise.all([
    getMapaInteractivoData(),
    getMapas(),
  ]);
  return <AdminMapaContent initialData={{ ...mapaData, mapas }} />;
}
