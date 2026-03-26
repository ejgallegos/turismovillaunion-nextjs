import data from '../../data/mapa-interactivo.json';
import type { Mapa } from './mapas.service';

export { Mapa };

export interface LugarMapa {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion?: string;
  telefono?: string;
  imagen: string;
  latitud: number;
  longitud: number;
  activo: boolean;
}

export interface TipMapa {
  id: string;
  texto: string;
  activo: boolean;
}

export interface ColectivoMapa {
  id: string;
  origen: string;
  horaSalida: string;
  horaLlegada: string;
  frecuencia: string;
  activo: boolean;
}

export interface CategoriaMapa {
  id: string;
  nombre: string;
  color: string;
  icono: string;
  activo: boolean;
}

export interface MapaInteractivoData {
  lugares: LugarMapa[];
  tips: TipMapa[];
  colectivos: ColectivoMapa[];
  categorias: CategoriaMapa[];
}

export async function getMapaInteractivoData(): Promise<MapaInteractivoData> {
  return data;
}

export async function getLugaresMapa(): Promise<LugarMapa[]> {
  const data = await getMapaInteractivoData();
  return data.lugares.filter(l => l.activo);
}

export async function getTipsMapa(): Promise<TipMapa[]> {
  const data = await getMapaInteractivoData();
  return data.tips.filter(t => t.activo);
}

export async function getColectivosMapa(): Promise<ColectivoMapa[]> {
  const data = await getMapaInteractivoData();
  return data.colectivos.filter(c => c.activo);
}

export async function getCategoriasMapa(): Promise<CategoriaMapa[]> {
  const data = await getMapaInteractivoData();
  return data.categorias.filter(c => c.activo);
}
