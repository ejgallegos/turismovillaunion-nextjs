import { getNovedades } from '@/lib/novedades.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { NovedadFormSheet } from './novedad-form-sheet';
import { DeleteNovedadAlert } from './delete-novedad-alert';

export const dynamic = 'force-dynamic';

export default async function AdminNovedadesPage() {
  const novedades = (await getNovedades()).reverse();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Novedades</h1>
        <NovedadFormSheet>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Novedad
          </Button>
        </NovedadFormSheet>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Novedades</CardTitle>
          <CardDescription>
            Aquí podrás editar y eliminar las novedades del sitio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {novedades.map((novedad) => (
                <TableRow key={novedad.id}>
                  <TableCell className="font-medium">{novedad.title}</TableCell>
                  <TableCell className="text-right">
                    <NovedadFormSheet novedad={novedad}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </NovedadFormSheet>
                    <DeleteNovedadAlert novedadId={novedad.id}>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </DeleteNovedadAlert>
                  </TableCell>
                </TableRow>
              ))}
               {novedades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No hay novedades para mostrar.
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
