'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Trash2, Edit, Bus, Compass, 
  Save, X, Download, FolderOpen
} from 'lucide-react';
import { 
  type TipMapa, type ColectivoMapa, type Mapa
} from '@/lib/admin-mapa.service';
import { 
  upsertTip, deleteTip, 
  upsertColectivo, deleteColectivo
} from './actions';
import { upsertMapa, deleteMapa } from '@/app/admin/mapas/actions';

interface MapaInteractivoData {
  lugares: any[];
  tips: TipMapa[];
  colectivos: ColectivoMapa[];
  mapas: Mapa[];
  categorias: any[];
}

interface Props {
  initialData: MapaInteractivoData;
}

export function AdminMapaContent({ initialData }: Props) {
  const [data, setData] = useState<MapaInteractivoData>(initialData);
  const [activeTab, setActiveTab] = useState('mapas');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Forms
  const [mapaForm, setMapaForm] = useState<Mapa>({ id: '', title: '', description: '', downloadUrl: '' });
  const [mapaFile, setMapaFile] = useState<File | null>(null);
  const [mapaFilePreview, setMapaFilePreview] = useState<string | null>(null);

  const [tipForm, setTipForm] = useState<TipMapa>({ id: '', texto: '', activo: true });

  const [colectivoForm, setColectivoForm] = useState<ColectivoMapa>({
    id: '', origen: '', horaSalida: '', horaLlegada: '', frecuencia: 'Diario', activo: true
  });

  // Reset forms
  const resetMapaForm = () => {
    setMapaForm({ id: '', title: '', description: '', downloadUrl: '' });
    setMapaFile(null);
    setMapaFilePreview(null);
  };

  const resetTipForm = () => setTipForm({ id: '', texto: '', activo: true });
  const resetColectivoForm = () => setColectivoForm({
    id: '', origen: '', horaSalida: '', horaLlegada: '', frecuencia: 'Diario', activo: true
  });

  // MAPAS handlers
  const handleSaveMapa = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('id', mapaForm.id || '');
      formData.append('title', mapaForm.title);
      formData.append('description', mapaForm.description);
      if (mapaFile) formData.append('downloadFile', mapaFile);
      
      const result = await upsertMapa(formData) as { success: boolean; error?: string };
      
      if (result.success) {
        // Refresh mapas from server
        window.location.reload();
      } else {
        alert(result.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving mapa:', error);
    }
    setIsSaving(false);
  };

  const handleDeleteMapa = async (id: string) => {
    if (!confirm('¿Eliminar este mapa?')) return;
    setIsSaving(true);
    try {
      await deleteMapa(id);
      setData(prev => ({ ...prev, mapas: prev.mapas.filter(m => m.id !== id) }));
    } catch (error) {
      console.error('Error deleting mapa:', error);
    }
    setIsSaving(false);
  };

  const handleEditMapa = (mapa: Mapa) => {
    setMapaForm(mapa);
    setMapaFile(null);
    setMapaFilePreview(mapa.downloadUrl || null);
    setEditingId(mapa.id);
  };

  // TIPS handlers
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

  // COLECTIVOS handlers
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
          <TabsTrigger value="mapas">Mapas ({data.mapas.length})</TabsTrigger>
          <TabsTrigger value="tips">Tips ({data.tips.length})</TabsTrigger>
          <TabsTrigger value="colectivos">Colectivos ({data.colectivos.length})</TabsTrigger>
        </TabsList>

        {/* MAPAS */}
        <TabsContent value="mapas">
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Mapas para Descargar</CardTitle>
              <CardDescription>Agrega o elimina mapas descargables (PDF, JPG, PNG)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold">{editingId ? 'Editar Mapa' : 'Agregar Nuevo Mapa'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Título</Label>
                    <Input 
                      value={mapaForm.title} 
                      onChange={e => setMapaForm({...mapaForm, title: e.target.value})} 
                      placeholder="Ej: Mapa de Villa Unión" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Descripción</Label>
                    <Input 
                      value={mapaForm.description} 
                      onChange={e => setMapaForm({...mapaForm, description: e.target.value})} 
                      placeholder="Descripción del mapa" 
                    />
                  </div>
                  <div>
                    <Label>Archivo (PDF, JPG, PNG)</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={mapaForm.downloadUrl} 
                        onChange={e => setMapaForm({...mapaForm, downloadUrl: e.target.value})} 
                        placeholder="/uploads/mapas/..." 
                        className="flex-1"
                      />
                      <input
                        type="file"
                        id="mapa-file-upload"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setMapaFile(file);
                            setMapaFilePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => document.getElementById('mapa-file-upload')?.click()}
                      >
                        <FolderOpen className="w-4 h-4" />
                      </Button>
                    </div>
                    {(mapaFilePreview || mapaForm.downloadUrl) && (
                      <div className="mt-2 flex items-center gap-2">
                        <Download className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">Archivo cargado</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveMapa} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />{isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={() => { resetMapaForm(); setEditingId(null); }}>
                      <X className="w-4 h-4 mr-2" />Cancelar
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {data.mapas.map(mapa => (
                  <div key={mapa.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{mapa.title}</p>
                        <p className="text-sm text-muted-foreground">{mapa.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditMapa(mapa)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteMapa(mapa.id)}>
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
              <CardDescription>Agrega o elimina tips informativos que se muestran en el mapa</CardDescription>
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
              <CardDescription>Agrega o elimina horarios de colectivos que se muestran en el mapa</CardDescription>
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
