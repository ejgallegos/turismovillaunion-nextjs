'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sun, Bus, Compass, Download
} from 'lucide-react';
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

export function InteractiveMap({ initialLugares = [], initialTips = [], initialColectivos = [] }: Props) {
  const [weather, setWeather] = useState<{temperature: number; weatherCode: number; windSpeed: number; humidity: number; uvIndex: number} | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lugares, setLugares] = useState<LugarMapa[]>(initialLugares);
  const [tips, setTips] = useState<TipMapa[]>(initialTips);
  const [colectivos, setColectivos] = useState<ColectivoMapa[]>(initialColectivos);

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
						Descubrí Villa Unión y sus alrededores. Explorá lugares,
						trová servicios y planificá tu viaje.
					</p>
				</div>

				{/* WIDGETS - 4 Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					{/* Clima */}
					<div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-4 shadow-lg">
						<div className="flex justify-between items-start mb-3">
							<div>
								<p className="text-white/80 text-xs font-medium">
									Clima Actual
								</p>
								<h3 className="text-2xl font-bold">
									Villa Unión
								</h3>
							</div>
							<Sun className="w-10 h-10" />
						</div>
						{weather ? (
							<>
								<div className="flex items-end gap-2 mb-3">
									<span className="text-5xl font-bold">
										{weather.temperature}°
									</span>
									<span className="text-lg pb-1">
										{getWeatherDescription(
											weather.weatherCode,
										)}
									</span>
								</div>
								<div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-3">
									<div className="text-center">
										<p className="text-[10px] text-white/70 uppercase">
											Viento
										</p>
										<p className="text-sm font-bold">
											{weather.windSpeed} km/h
										</p>
									</div>
									<div className="text-center">
										<p className="text-[10px] text-white/70 uppercase">
											Humedad
										</p>
										<p className="text-sm font-bold">
											{weather.humidity}%
										</p>
									</div>
									<div className="text-center">
										<p className="text-[10px] text-white/70 uppercase">
											UV
										</p>
										<p className="text-sm font-bold">
											{getUVLevel(weather.uvIndex)}
										</p>
									</div>
								</div>
							</>
						) : (
							<Skeleton className="h-24 w-full" />
						)}
					</div>

					{/* Colectivos */}
					<div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-primary">
						<h3 className="font-bold text-sm flex items-center gap-2 mb-3">
							<Bus className="w-4 h-4 text-primary" />
							Próximos Colectivos
						</h3>
						{upcomingBuses.length > 0 ? (
							<div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
								{upcomingBuses.slice(0, 2).map((bus, i) => (
									<div
										key={i}
										className="text-xs flex justify-between items-center"
									>
										<span className="font-medium text-primary">
											{bus.origen}
										</span>
										<span className="font-semibold">
											{bus.horaSalida}
										</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-xs text-muted-foreground">
								No hay colectivos próximos
							</p>
						)}
					</div>

					{/* Tips */}
					<div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-primary">
						<h3 className="font-bold text-sm flex items-center gap-2 mb-3">
							<Compass className="w-4 h-4 text-primary" />
							Tips de Viaje
						</h3>
						<ul className="space-y-2 text-xs max-h-[140px] overflow-y-auto pr-1">
							{activeTips.length > 0 ? (
								activeTips.map((tip, i) => (
									<li
										key={i}
										className="flex gap-2 items-start"
									>
										<span className="text-green-500">
											✓
										</span>
										<span>{tip.texto}</span>
									</li>
								))
							) : (
								<>
									<li className="flex gap-2 items-start">
										<span className="text-green-500">
											✓
										</span>
										<span>
											Reservá entradas a{" "}
											<strong>Talampaya</strong> con
											anticipación
										</span>
									</li>
									<li className="flex gap-2 items-start">
										<span className="text-green-500">
											✓
										</span>
										<span>
											Cargá combustible antes de salir a
											los parques
										</span>
									</li>
									<li className="flex gap-2 items-start">
										<span className="text-green-500">
											✓
										</span>
										<span>
											Llevá agua, protector solar y ropa
											liviana
										</span>
									</li>
								</>
							)}
						</ul>
					</div>

					{/* Mapas */}
					<div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-primary">
						<h3 className="font-bold text-sm flex items-center gap-2 mb-3">
							<Download className="w-4 h-4 text-primary" />
							Mapas para Descargar
						</h3>
						<div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
							{mapasData.map((mapa) => (
								<a
									key={mapa.id}
									href={mapa.downloadUrl}
									target="_blank"
									className="flex items-center justify-between text-xs p-2 bg-white dark:bg-slate-700 rounded hover:bg-slate-100 block"
								>
									<span className="truncate">
										{mapa.title}
									</span>
									<Download className="w-3 h-3 shrink-0 ml-2" />
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Google Maps Embed */}
				<div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
					<div className="p-3 border-b border-primary/5">
						<h3 className="font-bold text-sm">
							Mapa de Villa Unión y alrededores
						</h3>
					</div>
					<div className="h-[500px] xl:h-[700px] w-full">
						<iframe
							src="https://www.google.com/maps/d/embed?mid=1F3VQHqOqyy6tlGwqeVPG6ExZXu4snwY&femb=1&ll=-29.31712107337921%2C-68.22745714924574&z=16"
							width="100%"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							title="Mapa Interactivo de Villa Unión"
						/>
					</div>
				</div>
			</div>
		</section>
  );
}
