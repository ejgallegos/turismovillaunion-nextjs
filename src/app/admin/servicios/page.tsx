import { getServicios } from '@/lib/servicios.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { ServicioFormSheet } from './servicio-form-sheet';
import { DeleteServicioAlert } from './delete-servicio-alert';

export const dynamic = 'force-dynamic';

export default async function AdminServiciosPage() {
  const servicios = await getServicios();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Servicios</h1>
        <ServicioFormSheet>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Servicio
          </Button>
        </ServicioFormSheet>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Servicios</CardTitle>
          <CardDescription>
            Aquí podrás editar y eliminar los tipos de servicios ofrecidos.
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
              {servicios.map((servicio) => (
                <TableRow key={servicio.id}>
                  <TableCell className="font-medium">{servicio.title}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm truncate">{servicio.description}</TableCell>
                  <TableCell className="text-right">
                    <ServicioFormSheet servicio={servicio}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </ServicioFormSheet>
                    <DeleteServicioAlert servicioId={servicio.id}>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </DeleteServicioAlert>
                  </TableCell>
                </TableRow>
              ))}
               {servicios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No hay servicios para mostrar.
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
