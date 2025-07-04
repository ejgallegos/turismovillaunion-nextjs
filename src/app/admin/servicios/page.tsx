
import { getServicios } from '@/lib/servicios.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import Link from 'next/link';
import { DeleteServicioAlert } from './delete-servicio-alert';

export const dynamic = 'force-dynamic';

export default async function AdminServiciosPage() {
  const servicios = await getServicios();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Servicios</h1>
        <Button asChild>
          <Link href="/admin/servicios/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Servicio
          </Link>
        </Button>
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
                  <TableCell className="hidden md:table-cell max-w-sm truncate">
                    {servicio.description.replace(/<[^>]*>?/gm, '')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/servicios/${servicio.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </Button>
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
