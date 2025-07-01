import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://villaunion.tur.ar';

  const routes = [
    '/',
    '/atractivos',
    '/servicios',
    '/mapas',
    '/folletos',
    '/contacto',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
