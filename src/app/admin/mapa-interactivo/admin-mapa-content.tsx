'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Plus, Trash2, Edit, Bus, Compass, 
  Save, X, Check, ChevronDown, ChevronUp, FolderOpen
} from 'lucide-react';
import { 
  type LugarMapa, type TipMapa, type ColectivoMapa, type CategoriaMapa
} from '@/lib/admin-mapa.service';
import { 
  upsertLugar, deleteLugar, 
  upsertTip, deleteTip, 
  upsertColectivo, deleteColectivo
} from './actions';

interface MapaInteractivoData {
  lugares: LugarMapa[];
  tips: TipMapa[];
  colectivos: ColectivoMapa[];
  categorias: CategoriaMapa[];
}

interface Props {
  initialData: MapaInteractivoData;
}

export function AdminMapaContent({ initialData }: Props) {
  const [data, setData] = useState<MapaInteractivoData>(initialData);
  const [activeTab, setActiveTab] = useState('lugares');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [lugarForm, setLugarForm] = useState<LugarMapa>({
    id: '', nombre: '', categoria: 'atractivo', descripcion: '',
    direccion: '', telefono: '', imagen: '', latitud: -28.93, longitud: -68.22, activo: true
  });
  const [lugarImageFile, setLugarImageFile] = useState<File | null>(null);
  const [lugarImagePreview, setLugarImagePreview] = useState<string | null>(null);

  const [tipForm, setTipForm] = useState<TipMapa>({ id: '', texto: '', activo: true });

  const [colectivoForm, setColectivoForm] = useState<ColectivoMapa>({
    id: '', origen: '', horaSalida: '', horaLlegada: '', frecuencia: 'Diario', activo: true
  });

  const resetLugarForm = () => {
    setLugarForm({
      id: '', nombre: '', categoria: 'atractivo', descripcion: '',
      direccion: '', telefono: '', imagen: '', latitud: -28.93, longitud: -68.22, activo: true
    });
    setLugarImageFile(null);
    setLugarImagePreview(null);
  };

  const resetTipForm = () => setTipForm({ id: '', texto: '', activo: true });
  const resetColectivoForm = () => setColectivoForm({
    id: '', origen: '', horaSalida: '', horaLlegada: '', frecuencia: 'Diario', activo: true
  });

  const handleSaveLugar = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('id', lugarForm.id || '');
      formData.append('nombre', lugarForm.nombre);
      formData.append('categoria', lugarForm.categoria);
      formData.append('descripcion', lugarForm.descripcion);
      if (lugarForm.direccion) formData.append('direccion', lugarForm.direccion);
      if (lugarForm.telefono) formData.append('telefono', lugarForm.telefono);
      formData.append('imagen', lugarForm.imagen);
      if (lugarImageFile) formData.append('imagenFile', lugarImageFile);
      formData.append('latitud', lugarForm.latitud.toString());
      formData.append('longitud', lugarForm.longitud.toString());
      formData.append('activo', lugarForm.activo.toString());
      
      const result = await upsertLugar(formData) as { success: boolean; data?: LugarMapa; error?: string };
      
      if (result.success && result.data) {
        setData(prev => {
          const exists = prev.lugares.find(l => l.id === result.data?.id);
          if (exists) {
            return { ...prev, lugares: prev.lugares.map(l => l.id === result.data?.id ? result.data! : l) };
          }
          return { ...prev, lugares: [...prev.lugares, result.data!] };
        });
        resetLugarForm();
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error saving lugar:', error);
    }
    setIsSaving(false);
  };

  const handleDeleteLugar = async (id: string) => {
    if (!confirm('¿Eliminar este lugar?')) return;
    setIsSaving(true);
    try {
      await deleteLugar(id);
      setData(prev => ({ ...prev, lugares: prev.lugares.filter(l => l.id !== id) }));
    } catch (error) {
      console.error('Error deleting lugar:', error);
    }
    setIsSaving(false);
  };

  const handleEditLugar = (lugar: LugarMapa) => {
    setLugarForm(lugar);
    setLugarImageFile(null);
    setLugarImagePreview(lugar.imagen || null);
    setEditingId(lugar.id);
  };

  const handleSaveTip = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('id', tipForm.id || '');
      formData.append('texto', tipForm.texto);
      formData.append('activo', tipForm.activo.toString());
      
      const newTip = { ...tipForm, id: tipForm.id || `tip-${Date.now()}` };
      await upsertTip(formData);
      setData(prev => {
        const exists = prev.tips.find(t => t.id === newTip.id);
        if (exists) {
          return { ...prev, tips: prev.tips.map(t => t.id === newTip.id ? newTip : t) };
        }
        return { ...prev, tips: [...prev.tips, newTip] };
      });
      resetTipForm();
      setEditingId(null);
    } catch (error) {
      console.error('Error saving tip:', error);
    }
    setIsSaving(false);
  };

  const handleDeleteTip = async (id: string) => {
    if (!confirm('¿Eliminar este tip?')) return;
    setIsSaving(true);
    try {
      await deleteTip(id);
      setData(prev => ({ ...prev, tips: prev.tips.filter(t => t.id !== id) }));
    } catch (error) {
      console.error('Error deleting tip:', error);
    }
    setIsSaving(false);
  };

  const handleEditTip = (tip: TipMapa) => {
    setTipForm(tip);
    setEditingId(tip.id);
  };

  const handleSaveColectivo = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('id', colectivoForm.id || '');
      formData.append('origen', colectivoForm.origen);
      formData.append('horaSalida', colectivoForm.horaSalida);
      formData.append('horaLlegada', colectivoForm.horaLlegada);
      formData.append('frecuencia', colectivoForm.frecuencia);
      formData.append('activo', colectivoForm.activo.toString());
      
      const newColectivo = { ...colectivoForm, id: colectivoForm.id || `colectivo-${Date.now()}` };
      await upsertColectivo(formData);
      setData(prev => {
        const exists = prev.colectivos.find(c => c.id === newColectivo.id);
        if (exists) {
          return { ...prev, colectivos: prev.colectivos.map(c => c.id === newColectivo.id ? newColectivo : c) };
        }
        return { ...prev, colectivos: [...prev.colectivos, newColectivo] };
      });
      resetColectivoForm();
      setEditingId(null);
    } catch (error) {
      console.error('Error saving colectivo:', error);
    }
    setIsSaving(false);
  };

  const handleDeleteColectivo = async (id: string) => {
    if (!confirm('¿Eliminar este colectivo?')) return;
    setIsSaving(true);
    try {
      await deleteColectivo(id);
      setData(prev => ({ ...prev, colectivos: prev.colectivos.filter(c => c.id !== id) }));
    } catch (error) {
      console.error('Error deleting colectivo:', error);
    }
    setIsSaving(false);
  };

  const handleEditColectivo = (colectivo: ColectivoMapa) => {
    setColectivoForm(colectivo);
    setEditingId(colectivo.id);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        <MapPin className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Mapa Interactivo</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="lugares">Lugares ({data.lugares.length})</TabsTrigger>
          <TabsTrigger value="tips">Tips ({data.tips.length})</TabsTrigger>
          <TabsTrigger value="colectivos">Colectivos ({data.colectivos.length})</TabsTrigger>
        </TabsList>

        {/* LUGARES */}
        <TabsContent value="lugares">
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Lugares del Mapa</CardTitle>
              <CardDescription>Agrega, edita o elimina lugares turísticos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold">{editingId ? 'Editar Lugar' : 'Agregar Nuevo Lugar'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input value={lugarForm.nombre} onChange={e => setLugarForm({...lugarForm, nombre: e.target.value})} placeholder="Nombre del lugar" />
                  </div>
                  <div>
                    <Label>Categoría</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={lugarForm.categoria}
                      onChange={e => setLugarForm({...lugarForm, categoria: e.target.value})}
                    >
                      {data.categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Descripción</Label>
                    <Input value={lugarForm.descripcion} onChange={e => setLugarForm({...lugarForm, descripcion: e.target.value})} placeholder="Descripción del lugar" />
                  </div>
                  <div>
                    <Label>Dirección</Label>
                    <Input value={lugarForm.direccion} onChange={e => setLugarForm({...lugarForm, direccion: e.target.value})} placeholder="Dirección" />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={lugarForm.telefono} onChange={e => setLugarForm({...lugarForm, telefono: e.target.value})} placeholder="Teléfono" />
                  </div>
                  <div>
                    <Label>URL Imagen</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={lugarForm.imagen} 
                        onChange={e => setLugarForm({...lugarForm, imagen: e.target.value})} 
                        placeholder="/images/..." 
                        className="flex-1"
                      />
                      <input
                        type="file"
                        id="lugar-image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLugarImageFile(file);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result;
                              if (typeof result === 'string') {
                                setLugarImagePreview(result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => document.getElementById('lugar-image-upload')?.click()}
                      >
                        <FolderOpen className="w-4 h-4" />
                      </Button>
                    </div>
                    {(lugarImagePreview || lugarForm.imagen) && (
                      <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border">
                        <img 
                          src={lugarImagePreview || lugarForm.imagen} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLugarImageFile(null);
                            setLugarImagePreview(null);
                            setLugarForm({ ...lugarForm, imagen: '' });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Latitud</Label>
                    <Input type="number" step="0.0001" value={lugarForm.latitud} onChange={e => setLugarForm({...lugarForm, latitud: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Longitud</Label>
                    <Input type="number" step="0.0001" value={lugarForm.longitud} onChange={e => setLugarForm({...lugarForm, longitud: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveLugar} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />{isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={() => { resetLugarForm(); setEditingId(null); }}>
                      <X className="w-4 h-4 mr-2" />Cancelar
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {data.lugares.map(lugar => (
                  <div key={lugar.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{lugar.nombre}</p>
                        <p className="text-sm text-muted-foreground">{lugar.categoria} • {lugar.direccion}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditLugar(lugar)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteLugar(lugar.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TIPS */}
        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Tips de Viaje</CardTitle>
              <CardDescription>Agrega o elimina tips informativos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold">{editingId ? 'Editar Tip' : 'Agregar Nuevo Tip'}</h4>
                <div>
                  <Label>Texto del Tip</Label>
                  <Input value={tipForm.texto} onChange={e => setTipForm({...tipForm, texto: e.target.value})} placeholder="Ej: Reservá entradas a Talampaya" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveTip} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />{isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={() => { resetTipForm(); setEditingId(null); }}>
                      <X className="w-4 h-4 mr-2" />Cancelar
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {data.tips.map(tip => (
                  <div key={tip.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Compass className="w-5 h-5 text-green-500" />
                      <span>{tip.texto}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTip(tip)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTip(tip.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COLECTIVOS */}
        <TabsContent value="colectivos">
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Colectivos</CardTitle>
              <CardDescription>Agrega o elimina horarios de colectivos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold">{editingId ? 'Editar Colectivo' : 'Agregar Nuevo Colectivo'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Origen</Label>
                    <Input value={colectivoForm.origen} onChange={e => setColectivoForm({...colectivoForm, origen: e.target.value})} placeholder="Ej: La Rioja Capital" />
                  </div>
                  <div>
                    <Label>Frecuencia</Label>
                    <Input value={colectivoForm.frecuencia} onChange={e => setColectivoForm({...colectivoForm, frecuencia: e.target.value})} placeholder="Ej: Diario" />
                  </div>
                  <div>
                    <Label>Hora de Salida</Label>
                    <Input value={colectivoForm.horaSalida} onChange={e => setColectivoForm({...colectivoForm, horaSalida: e.target.value})} placeholder="07:00" />
                  </div>
                  <div>
                    <Label>Hora de Llegada</Label>
                    <Input value={colectivoForm.horaLlegada} onChange={e => setColectivoForm({...colectivoForm, horaLlegada: e.target.value})} placeholder="10:30" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveColectivo} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />{isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={() => { resetColectivoForm(); setEditingId(null); }}>
                      <X className="w-4 h-4 mr-2" />Cancelar
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {data.colectivos.map(colectivo => (
                  <div key={colectivo.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bus className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{colectivo.origen}</p>
                        <p className="text-sm text-muted-foreground">{colectivo.horaSalida} → {colectivo.horaLlegada} ({colectivo.frecuencia})</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditColectivo(colectivo)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteColectivo(colectivo.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
