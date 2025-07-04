import { getFolletos } from '@/lib/folletos.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { FolletoFormSheet } from './folleto-form-sheet';
import { DeleteFolletoAlert } from './delete-folleto-alert';

export const dynamic = 'force-dynamic';

export default async function AdminFolletosPage() {
  const folletos = await getFolletos();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Folletos</h1>
        <FolletoFormSheet>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Folleto
          </Button>
        </FolletoFormSheet>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Folletos</CardTitle>
          <CardDescription>
            Aquí podrás editar y eliminar los folletos descargables.
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
              {folletos.map((folleto) => (
                <TableRow key={folleto.id}>
                  <TableCell className="font-medium">{folleto.title}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm truncate">
                     {folleto.description.replace(/<[^>]*>?/gm, '')}
                  </TableCell>
                  <TableCell className="text-right">
                    <FolletoFormSheet folleto={folleto}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </FolletoFormSheet>
                    <DeleteFolletoAlert folletoId={folleto.id}>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </DeleteFolletoAlert>
                  </TableCell>
                </TableRow>
              ))}
               {folletos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No hay folletos para mostrar.
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
