import { MetadataRoute } from 'next';
import { getAttractions } from '@/lib/atractivos.service';
import { getServicios } from '@/lib/servicios.service';
import { getNovedades } from '@/lib/novedades.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://villaunion.tur.ar';

  // Static routes
  const staticRoutes = [
    '/',
    '/atractivos',
    '/servicios',
    '/novedades',
    '/mapas',
    '/folletos',
    '/contacto',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));

  // Dynamic attractions routes
  const attractions = await getAttractions();
  const attractionRoutes = attractions.map((attraction) => ({
    url: `${baseUrl}/atractivos/${attraction.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic novedades routes
  const novedades = await getNovedades();
  const novedadRoutes = novedades.map((novedad) => ({
    url: `${baseUrl}/novedades/${novedad.id}`,
    lastModified: new Date(novedad.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic servicios routes
  const servicios = await getServicios();
  const servicioRoutes = servicios.map((servicio) => ({
    url: `${baseUrl}/servicios/${servicio.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...attractionRoutes,
    ...novedadRoutes,
    ...servicioRoutes,
  ];
}
