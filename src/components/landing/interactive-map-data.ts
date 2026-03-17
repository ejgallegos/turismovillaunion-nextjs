export interface MapPlace {
  id: string;
  name: string;
  category: 'hotel' | 'restaurante' | 'estacion' | 'atractivo' | 'comercio' | 'servicio';
  description: string;
  address?: string;
  phone?: string;
  imageUrl: string;
  coordinates: [number, number];
}

export const categoryConfig = {
  hotel: { label: 'Hoteles', color: '#3b82f6', icon: 'bed' },
  restaurante: { label: 'Restaurantes', color: '#f97316', icon: 'utensils' },
  estacion: { label: 'Estaciones', color: '#eab308', icon: 'fuel-pump' },
  atractivo: { label: 'Cajeros', color: '#ef4444', icon: 'landmark' },
  comercio: { label: 'Comercios', color: '#8b5cf6', icon: 'store' },
  servicio: { label: 'Servicios', color: '#06b6d4', icon: 'wrench' }
};

export const tileLayers = {
  calle: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    name: 'Calles'
  },
  satelite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    name: 'Satélite'
  },
  terreno: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap',
    name: 'Terreno'
  }
};
