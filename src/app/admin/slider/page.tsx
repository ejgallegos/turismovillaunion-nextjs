import { getSliderItems, type SliderItem } from '@/lib/slider.service';
import { getAttractions, Attraction } from '@/lib/atractivos.service';
import { getNovedades, Novedad } from '@/lib/novedades.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Film, Newspaper } from "lucide-react";
import { AddSliderItemForm } from './add-slider-item-form';
import { DeleteSliderItemAlert } from './delete-slider-item-alert';

export const dynamic = 'force-dynamic';

function getItemDisplayData(item: SliderItem, attractions: Attraction[], novedades: Novedad[]) {
    if (item.type === 'atractivo') {
        const attraction = attractions.find(a => a.id === item.id);
        return { 
            type: 'Atractivo', 
            icon: <Film className="h-4 w-4 text-muted-foreground" />,
            originalExists: !!attraction
        };
    }
    if (item.type === 'novedad') {
        const novedad = novedades.find(n => n.id === item.id);
        return { 
            type: 'Novedad', 
            icon: <Newspaper className="h-4 w-4 text-muted-foreground" />,
            originalExists: !!novedad
        };
    }
    return { type: 'Desconocido', icon: null, originalExists: false };
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
                  const displayData = getItemDisplayData(item, attractions, novedades);
                  return (
                    <TableRow key={item.uuid}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {displayData.icon}
                          <span>{item.title}</span>
                        </div>
                        {!displayData.originalExists && (
                            <p className="pl-6 text-xs text-destructive">
                                (El atractivo/novedad original fue eliminado)
                            </p>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{displayData.type}</TableCell>
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
