import { getSliderItems } from '@/lib/slider.service';
import { getAttractions, Attraction } from '@/lib/atractivos.service';
import { getNovedades, Novedad } from '@/lib/novedades.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Film, Newspaper } from "lucide-react";
import { AddSliderItemForm } from './add-slider-item-form';
import { DeleteSliderItemAlert } from './delete-slider-item-alert';

export const dynamic = 'force-dynamic';

function getItemData(item: { type: string, id: string }, attractions: Attraction[], novedades: Novedad[]) {
    if (item.type === 'atractivo') {
        const attraction = attractions.find(a => a.id === item.id);
        return { title: attraction?.title, type: 'Atractivo', icon: <Film className="h-4 w-4 text-muted-foreground" /> };
    }
    if (item.type === 'novedad') {
        const novedad = novedades.find(n => n.id === item.id);
        return { title: novedad?.title, type: 'Novedad', icon: <Newspaper className="h-4 w-4 text-muted-foreground" /> };
    }
    return { title: 'Elemento no encontrado', type: 'Desconocido', icon: null };
}

export default async function AdminSliderPage() {
  const [sliderItems, attractions, novedades] = await Promise.all([
    getSliderItems(),
    getAttractions(),
    getNovedades()
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Elementos del Slider Principal</CardTitle>
            <CardDescription>
              Esta es la lista de elementos que aparecen en el slider de la página de inicio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sliderItems.map((item) => {
                  const data = getItemData(item, attractions, novedades);
                  return (
                    <TableRow key={item.uuid}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {data.icon}
                        {data.title || 'Elemento no encontrado'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{data.type}</TableCell>
                      <TableCell className="text-right">
                        <DeleteSliderItemAlert uuid={item.uuid}>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </DeleteSliderItemAlert>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sliderItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No hay elementos en el slider.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <AddSliderItemForm attractions={attractions} novedades={novedades} />
      </div>
    </div>
  );
}
