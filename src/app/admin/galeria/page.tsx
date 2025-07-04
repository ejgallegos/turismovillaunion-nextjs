
import { getGalleryItems } from '@/lib/galeria.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import Link from 'next/link';
import { DeleteGaleriaAlert } from './delete-galeria-alert';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AdminGaleriaPage() {
  const galleryItems = await getGalleryItems();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Galería</h1>
        <Button asChild>
          <Link href="/admin/galeria/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Imagen
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Imágenes de la Galería</CardTitle>
          <CardDescription>
            Aquí podrás editar y eliminar las imágenes de la galería.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm truncate">
                    {item.description.replace(/<[^>]*>?/gm, '')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/galeria/${item.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </Button>
                    <DeleteGaleriaAlert galleryItemId={item.id}>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </DeleteGaleriaAlert>
                  </TableCell>
                </TableRow>
              ))}
               {galleryItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No hay imágenes en la galería.
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
