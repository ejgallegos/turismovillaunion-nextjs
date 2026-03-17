'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Sun, ChevronRight, Bus, Navigation, Compass, 
  Search, Layers, Share2, X, Check, Loader2, Bed, Utensils,
  Fuel, Store, Wrench, Landmark, Download
} from 'lucide-react';
import { 
  categoryConfig,
  tileLayers, 
  type MapPlace 
} from './interactive-map-data';
import { getLugaresMapa, getTipsMapa, getColectivosMapa, type LugarMapa, type TipMapa, type ColectivoMapa } from '@/lib/admin-mapa.service';

interface Props {
  initialLugares?: LugarMapa[];
  initialTips?: TipMapa[];
  initialColectivos?: ColectivoMapa[];
}

const mapasData = [
  { id: 'provincia-de-la-rioja', title: 'Provincia de La Rioja', downloadUrl: '/uploads/mapas/provincia-de-la-rioja/mapa-1751838091484.pdf' },
  { id: 'villa-union', title: 'Villa Unión', downloadUrl: '/uploads/mapas/villa-uni-n/mapa-1751838209011.jpeg' },
  { id: 'guandacol', title: 'Guandacol', downloadUrl: '/uploads/mapas/guandacol/mapa-1751838274235.jpeg' },
  { id: 'pagancillo', title: 'Pagancillo', downloadUrl: '/uploads/mapas/pagancillo/mapa-1751838320208.jpeg' },
];

declare global {
  interface Window {
    L: any;
  }
}

type CategoryKey = keyof typeof categoryConfig;
type TileKey = keyof typeof tileLayers;

const categoryIcons: Record<CategoryKey, React.ElementType> = {
  hotel: Bed,
  restaurante: Utensils,
  estacion: Fuel,
  atractivo: Landmark,
  comercio: Store,
  servicio: Wrench
};

function createMarkerIcon(color: string, isSelected: boolean = false) {
  const size = isSelected ? 36 : 28;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3" fill="white" stroke="${color}"/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function MapContent({ 
  places, 
  selectedCategories, 
  activeTileLayer, 
  selectedPlaceId,
  onPlaceClick,
  onBoundsChange,
  userLocation,
  searchResults,
  onSearchResultClick
}: { 
  places: MapPlace[];
  selectedCategories: string[];
  activeTileLayer: TileKey;
  selectedPlaceId: string | null;
  onPlaceClick: (place: MapPlace) => void;
  onBoundsChange: (bounds: any) => void;
  userLocation: [number, number] | null;
  searchResults: MapPlace[];
  onSearchResultClick: (place: MapPlace) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const searchMarkersRef = useRef<any[]>([]);

  const getCategoryColor = (category: string) => {
    const config = categoryConfig[category as CategoryKey];
    return config?.color || '#ef4444';
  };

  const addMarkers = useCallback((map: any) => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const filteredPlaces = places.filter(p => 
      selectedCategories.length === 0 || selectedCategories.includes(p.category)
    );

    filteredPlaces.forEach((place) => {
      const isSelected = selectedPlaceId === place.id;
      const color = getCategoryColor(place.category);
      
      const marker = window.L.marker(place.coordinates, {
        icon: window.L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background-color: ${color};
            width: ${isSelected ? '40px' : '32px'};
            height: ${isSelected ? '40px' : '32px'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            border: 3px solid white;
            transition: all 0.2s;
            ${isSelected ? 'z-index: 1000; transform: rotate(-45deg) scale(1.2);' : ''}
          ">
            <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>`,
          iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
          iconAnchor: [isSelected ? 20 : 16, isSelected ? 40 : 32]
        })
      });

      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui, sans-serif;">
          <div style="position: relative; height: 100px; width: 100%; margin-bottom: 8px; overflow: hidden; border-radius: 8px;">
            <img src="${place.imageUrl}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover;" 
              onerror="this.src='https://via.placeholder.com/200x100?text=Sin+imagen'"/>
            <div style="position: absolute; top: 8px; right: 8px; background: ${color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">
              ${categoryConfig[place.category as CategoryKey]?.label || place.category}
            </div>
          </div>
          <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 4px 0; color: #1f2937;">${place.name}</h3>
          <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">${place.description}</p>
          ${place.address ? `<p style="font-size: 11px; color: #9ca3af; margin: 0 0 8px 0;">📍 ${place.address}</p>` : ''}
          ${place.phone ? `<p style="font-size: 11px; color: #9ca3af; margin: 0 0 8px 0;">📞 ${place.phone}</p>` : ''}
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${place.coordinates[0]},${place.coordinates[1]}" 
               target="_blank" 
               style="flex: 1; display: block; text-align: center; background: #8b2b97; color: white; padding: 8px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold;">
              Cómo Llegar →
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'custom-popup'
      });

      marker.on('click', () => {
        onPlaceClick(place);
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [places, selectedCategories, selectedPlaceId, onPlaceClick]);

  const addUserMarker = useCallback((map: any) => {
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    
    if (userLocation) {
      const userIcon = window.L.divIcon({
        className: 'user-marker',
        html: `<div style="
          width: 20px;
          height: 20px;
          background: #22c55e;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.3), 0 3px 10px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      userMarkerRef.current = window.L.marker(userLocation, { icon: userIcon })
        .addTo(map)
        .bindPopup('Tu ubicación');
    }
  }, [userLocation]);

  const addSearchMarkers = useCallback((map: any) => {
    searchMarkersRef.current.forEach(m => m.remove());
    searchMarkersRef.current = [];

    searchResults.forEach((place) => {
      const marker = window.L.marker(place.coordinates, {
        icon: window.L.divIcon({
          className: 'search-marker',
          html: `<div style="
            background-color: #10b981;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">
            <div style="transform: rotate(45deg);">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35" stroke="white" stroke-width="2" fill="none"/>
              </svg>
            </div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      });

      marker.bindPopup(`
        <div style="min-width: 180px;">
          <h3 style="font-size: 13px; font-weight: bold; margin: 0 0 4px 0;">${place.name}</h3>
          <p style="font-size: 11px; color: #666; margin: 0;">${place.category}</p>
          <button onclick="window.dispatchEvent(new CustomEvent('searchPlaceClick', {detail: '${place.id}'}))" 
            style="margin-top: 8px; width: 100%; padding: 6px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            Ver en mapa
          </button>
        </div>
      `);

      marker.addTo(map);
      searchMarkersRef.current.push(marker);
    });
  }, [searchResults]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      
      if (mapInstanceRef.current || !mapRef.current) return;

      const map = L.map(mapRef.current, {
			center: [-29.326528920507034, -68.22761168562037],
			zoom: 16,
			zoomControl: false,
			scrollWheelZoom: false,
		});

      L.tileLayer(tileLayers[activeTileLayer].url, {
        attribution: tileLayers[activeTileLayer].attribution
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      const villaUnionMarker = L.marker(
			[-29.326528920507034, -68.22761168562037],
			{
				icon: L.divIcon({
					className: "villa-union-marker",
					html: `<div style="
            background: linear-gradient(135deg, #8b2b97, #6b21a8);
            color: white;
            padding: 8px 12px 8px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 11px;
            box-shadow: 0 4px 15px rgba(139, 43, 151, 0.4);
            white-space: nowrap;
          ">📍 Sec. de Turismo</div>`,
					iconSize: [120, 36],
					iconAnchor: [60, 18],
				}),
			},
		).addTo(map);

      villaUnionMarker.bindPopup(`
        <div style="text-align: center;">
          <h3 style="font-weight: bold; margin: 0 0 4px 0;">Villa Unión</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">Villa Unión, La Rioja</p>
        </div>
      `);

      mapInstanceRef.current = map;
      addMarkers(map);
      
      if (userLocation) {
        addUserMarker(map);
      }

      if (searchResults.length > 0) {
        addSearchMarkers(map);
      }

      map.on('moveend', () => {
        onBoundsChange(map.getBounds());
      });
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      if (mapInstanceRef.current._tilePane) {
        const newUrl = tileLayers[activeTileLayer].url;
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof window.L.TileLayer) {
            layer.setUrl(newUrl);
          }
        });
      }
    }
  }, [activeTileLayer]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      addMarkers(mapInstanceRef.current);
    }
  }, [selectedCategories, selectedPlaceId, addMarkers]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      addUserMarker(mapInstanceRef.current);
    }
  }, [userLocation, addUserMarker]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      addSearchMarkers(mapInstanceRef.current);
    }
  }, [searchResults, addSearchMarkers]);

  useEffect(() => {
    if (selectedPlaceId && mapInstanceRef.current) {
      const place = places.find(p => p.id === selectedPlaceId);
      if (place) {
        mapInstanceRef.current.flyTo(place.coordinates, 14, {
          duration: 1
        });
      }
    }
  }, [selectedPlaceId, places]);

  return <div ref={mapRef} className="h-full w-full" />;
}

export function InteractiveMap({ initialLugares = [], initialTips = [], initialColectivos = [] }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTileLayer, setActiveTileLayer] = useState<TileKey>('calle');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MapPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [weather, setWeather] = useState<{temperature: number; weatherCode: number; windSpeed: number; humidity: number; uvIndex: number} | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lugares, setLugares] = useState<LugarMapa[]>(initialLugares);
  const [tips, setTips] = useState<TipMapa[]>(initialTips);
  const [colectivos, setColectivos] = useState<ColectivoMapa[]>(initialColectivos);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (initialLugares.length === 0) {
        const [l, t, c] = await Promise.all([
          getLugaresMapa(),
          getTipsMapa(),
          getColectivosMapa(),
        ]);
        setLugares(l);
        setTips(t);
        setColectivos(c);
      }
    }
    fetchData();
  }, [initialLugares]);

  const mapPlaces: MapPlace[] = lugares.map(l => ({
    id: l.id,
    name: l.nombre,
    category: l.categoria as MapPlace['category'],
    description: l.descripcion,
    address: l.direccion,
    phone: l.telefono,
    imageUrl: l.imagen,
    coordinates: [l.latitud, l.longitud] as [number, number],
  }));

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-28.93&longitude=-68.22&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,uv_index&timezone=America/Argentina/La_Rioja'
        );
        const data = await res.json();
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          windSpeed: Math.round(data.current.wind_speed_10m),
          humidity: data.current.relative_humidity_2m,
          uvIndex: data.current.uv_index,
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    }
    fetchWeather();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const results = mapPlaces.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === Object.keys(categoryConfig).length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(Object.keys(categoryConfig));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocating(false);
        alert('No se pudo obtener tu ubicación');
      }
    );
  };

  const handlePlaceClick = (place: MapPlace) => {
    setSelectedPlaceId(place.id);
  };

  const handleSharePlace = async (place: MapPlace) => {
    const url = `${window.location.origin}/mapa-interactivo?place=${place.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: `Mira ${place.name} en Villa Unión`,
          url
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopiedId(place.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getUVLevel = (uv: number): string => {
    if (uv <= 2) return 'Bajo';
    if (uv <= 5) return 'Moderado';
    if (uv <= 7) return 'Alto';
    if (uv <= 10) return 'Muy Alto';
    return 'Extremo';
  };

  const getWeatherDescription = (code: number): string => {
    const descriptions: Record<number, string> = {
      0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado',
      3: 'Nublado', 45: 'Niebla', 51: 'Llovizna', 61: 'Lluvia',
      71: 'Nieve', 80: 'Chubascos', 95: 'Tormenta'
    };
    return descriptions[code] || 'Despejado';
  };

  const filteredPlaces = selectedCategories.length === 0 
    ? mapPlaces 
    : mapPlaces.filter((p) => selectedCategories.includes(p.category));

  const getUpcomingBuses = () => {
    const currentTotalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return colectivos
      .map(bus => {
        const [h, m] = bus.horaSalida.split(':').map(Number);
        return { ...bus, diffMinutes: (h * 60 + m) - currentTotalMinutes };
      })
      .filter(b => b.diffMinutes >= -30 && b.diffMinutes <= 180)
      .sort((a, b) => a.diffMinutes - b.diffMinutes)
      .slice(0, 4);
  };

  const upcomingBuses = getUpcomingBuses();
  const activeTips = tips.filter(t => t.activo).slice(0, 5);

  return (
    <section className="w-full pt-28 pb-8">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-3">
            Mapa Interactivo
          </h2>
          <p className="text-muted-foreground text-lg">
            Descubrí Villa Unión y sus alrededores. Explorá lugares, trová servicios y planificá tu viaje.
          </p>
        </div>

        {/* WIDGETS - ANCHO COMPLETO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Clima */}
          <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-white/80 text-xs font-medium">Clima Actual</p>
                <h3 className="text-2xl font-bold">Villa Unión</h3>
              </div>
              <Sun className="w-10 h-10" />
            </div>
            {weather ? (
              <>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-5xl font-bold">{weather.temperature}°</span>
                  <span className="text-lg pb-1">{getWeatherDescription(weather.weatherCode)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-3">
                  <div className="text-center">
                    <p className="text-[10px] text-white/70 uppercase">Viento</p>
                    <p className="text-sm font-bold">{weather.windSpeed} km/h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-white/70 uppercase">Humedad</p>
                    <p className="text-sm font-bold">{weather.humidity}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-white/70 uppercase">UV</p>
                    <p className="text-sm font-bold">{getUVLevel(weather.uvIndex)}</p>
                  </div>
                </div>
              </>
            ) : <Skeleton className="h-24 w-full" />}
          </div>

          {/* Colectivos */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-primary">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><Bus className="w-4 h-4 text-primary" />Próximos Colectivos</h3>
            {upcomingBuses.length > 0 ? (
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {upcomingBuses.slice(0, 2).map((bus, i) => (
                  <div key={i} className="text-xs flex justify-between items-center">
                    <span className="font-medium text-primary">{bus.origen}</span>
                    <span className="font-semibold">{bus.horaSalida}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-muted-foreground">No hay colectivos próximos</p>}
          </div>

          {/* Tips */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-primary">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><Compass className="w-4 h-4 text-primary" />Tips de Viaje</h3>
            <ul className="space-y-2 text-xs max-h-[140px] overflow-y-auto pr-1">
              {activeTips.length > 0 ? (
                activeTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 items-start"><span className="text-green-500">✓</span><span>{tip.texto}</span></li>
                ))
              ) : (
                <>
                  <li className="flex gap-2 items-start"><span className="text-green-500">✓</span><span>Reservá entradas a <strong>Talampaya</strong> con anticipación</span></li>
                  <li className="flex gap-2 items-start"><span className="text-green-500">✓</span><span>Cargá combustible antes de salir a los parques</span></li>
                  <li className="flex gap-2 items-start"><span className="text-green-500">✓</span><span>Llevá agua, protector solar y ropa liviana</span></li>
                </>
              )}
            </ul>
          </div>

          {/* Mapas */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-primary">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><Download className="w-4 h-4 text-primary" />Mapas para Descargar</h3>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {mapasData.map((mapa) => (
                <a key={mapa.id} href={mapa.downloadUrl} target="_blank" className="flex items-center justify-between text-xs p-2 bg-white dark:bg-slate-700 rounded hover:bg-slate-100 block">
                  <span className="truncate">{mapa.title}</span>
                  <Download className="w-3 h-3 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-3 space-y-4 order-2 xl:order-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar lugares..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                )}
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded-lg overflow-hidden">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setSelectedPlaceId(result.id);
                        setSearchQuery(result.name);
                        setSearchResults([]);
                      }}
                      className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 border-b last:border-b-0"
                    >
                      <p className="font-medium text-sm">{result.name}</p>
                      <p className="text-xs text-muted-foreground">{categoryConfig[result.category as CategoryKey]?.label}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Categorías</h3>
                <button
                  onClick={handleSelectAllCategories}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  {selectedCategories.length === Object.keys(categoryConfig).length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const Icon = categoryIcons[key as CategoryKey];
                  const isSelected = selectedCategories.length === 0 || selectedCategories.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => handleCategoryToggle(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected 
                          ? 'text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                      style={{ 
                        backgroundColor: isSelected ? config.color : undefined 
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm p-4">
              <h3 className="font-bold text-sm mb-3">Capas del Mapa</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(tileLayers).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTileLayer(key as TileKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTileLayer === key
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {config.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Lugares ({filteredPlaces.length})</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  {showFilters ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              
              {showFilters && (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredPlaces.slice(0, 20).map((place) => (
                    <button
                      key={place.id}
                      onClick={() => setSelectedPlaceId(place.id)}
                      onMouseEnter={() => setHoveredPlaceId(place.id)}
                      onMouseLeave={() => setHoveredPlaceId(null)}
                      className={`w-full p-2 text-left rounded-lg transition-all ${
                        selectedPlaceId === place.id
                          ? 'bg-primary/10 border border-primary'
                          : hoveredPlaceId === place.id
                          ? 'bg-slate-50 dark:bg-slate-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: categoryConfig[place.category as CategoryKey]?.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs truncate">{place.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {categoryConfig[place.category as CategoryKey]?.label}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSharePlace(place);
                          }}
                          className="shrink-0 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                        >
                          {copiedId === place.id ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Share2 className="w-3 h-3 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MAPA */}
          <div className="xl:col-span-9 order-1 xl:order-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-primary/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">Mapa de Villa Unión</h3>
                  <span className="text-xs text-muted-foreground">
                    {filteredPlaces.length} lugares
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="text-xs"
                  >
                    {isLocating ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Navigation className="w-3 h-3 mr-1" />
                    )}
                    Mi Ubicación
                  </Button>
                </div>
              </div>

              <div className="h-[500px] xl:h-[700px] w-full relative z-0">
                {isClient ? (
                  <MapContent
                    places={mapPlaces}
                    selectedCategories={selectedCategories}
                    activeTileLayer={activeTileLayer}
                    selectedPlaceId={selectedPlaceId}
                    onPlaceClick={handlePlaceClick}
                    onBoundsChange={() => {}}
                    userLocation={userLocation}
                    searchResults={searchResults}
                    onSearchResultClick={(place) => {
                      setSelectedPlaceId(place.id);
                      setSearchQuery(place.name);
                      setSearchResults([]);
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
