import { getAttractions } from '@/lib/atractivos.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { AtractivoFormSheet } from './atractivo-form-sheet';
import { DeleteAtractivoAlert } from './delete-atractivo-alert';

export const dynamic = 'force-dynamic';

export default async function AdminAtractivosPage() {
  const attractions = await getAttractions();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Atractivos</h1>
        <AtractivoFormSheet>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Atractivo
          </Button>
        </AtractivoFormSheet>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Atractivos</CardTitle>
          <CardDescription>
            Aquí podrás editar y eliminar los atractivos turísticos existentes.
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
              {attractions.map((attraction) => (
                <TableRow key={attraction.id}>
                  <TableCell className="font-medium">{attraction.title}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm truncate">
                    {attraction.description.replace(/<[^>]*>/g, '')}
                  </TableCell>
                  <TableCell className="text-right">
                    <AtractivoFormSheet attraction={attraction}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </AtractivoFormSheet>
                    <DeleteAtractivoAlert attractionId={attraction.id}>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </DeleteAtractivoAlert>
                  </TableCell>
                </TableRow>
              ))}
               {attractions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No hay atractivos para mostrar.
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
