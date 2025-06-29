import { getEventos } from '@/lib/eventos.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EventoFormSheet } from './evento-form-sheet';
import { DeleteEventoAlert } from './delete-evento-alert';

export default async function AdminEventosPage() {
  const eventos = await getEventos();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Eventos</h1>
        <EventoFormSheet>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Evento
          </Button>
        </EventoFormSheet>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>
            Aquí podrás editar y eliminar los eventos y festivales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="hidden md:table-cell">Categoría</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.map((evento) => (
                <TableRow key={evento.id}>
                  <TableCell className="font-medium">{evento.title}</TableCell>
                  <TableCell>
                    {format(new Date(evento.date), "dd 'de' MMMM, yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{evento.category}</TableCell>
                  <TableCell className="text-right">
                    <EventoFormSheet evento={evento}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </EventoFormSheet>
                    <DeleteEventoAlert eventoId={evento.id}>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </DeleteEventoAlert>
                  </TableCell>
                </TableRow>
              ))}
               {eventos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No hay eventos para mostrar.
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
