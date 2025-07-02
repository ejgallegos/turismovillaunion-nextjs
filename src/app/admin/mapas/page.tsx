import { getMapas } from '@/lib/mapas.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { MapaFormSheet } from './mapa-form-sheet';
import { DeleteMapaAlert } from './delete-mapa-alert';

export const dynamic = 'force-dynamic';

export default async function AdminMapasPage() {
  const mapas = await getMapas();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Mapas</h1>
        <MapaFormSheet>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Mapa
          </Button>
        </MapaFormSheet>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Mapas</CardTitle>
          <CardDescription>
            Aquí podrás editar y eliminar los mapas descargables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mapas.map((mapa) => (
                <TableRow key={mapa.id}>
                  <TableCell className="font-medium">{mapa.title}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm truncate">{mapa.description}</TableCell>
                  <TableCell className="text-right">
                    <MapaFormSheet mapa={mapa}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </MapaFormSheet>
                    <DeleteMapaAlert mapaId={mapa.id}>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </DeleteMapaAlert>
                  </TableCell>
                </TableRow>
              ))}
               {mapas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No hay mapas para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
