
import { getLocalidades } from '@/lib/localidades.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import Link from 'next/link';
import { DeleteLocalidadAlert } from './delete-localidad-alert';

export const dynamic = 'force-dynamic';

export default async function AdminLocalidadesPage() {
  const localidades = await getLocalidades();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Localidades</h1>
        <Button asChild>
          <Link href="/admin/localidades/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Localidad
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Localidades</CardTitle>
          <CardDescription>
            Aquí podrás editar y eliminar las localidades.
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
              {localidades.map((localidad) => (
                <TableRow key={localidad.id}>
                  <TableCell className="font-medium">{localidad.title}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm truncate">
                    {localidad.description.replace(/<[^>]*>?/gm, '')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/localidades/${localidad.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </Button>
                    <DeleteLocalidadAlert localidadId={localidad.id}>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </DeleteLocalidadAlert>
                  </TableCell>
                </TableRow>
              ))}
               {localidades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No hay localidades para mostrar.
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
