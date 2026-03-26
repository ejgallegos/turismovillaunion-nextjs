'use client';

import { useState } from 'react';
import type { SliderItem } from '@/lib/slider.service';
import type { Attraction } from '@/lib/atractivos.service';
import type { Novedad } from '@/lib/novedades.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Film, Newspaper, Pencil, X, ExternalLink } from "lucide-react";
import { AddSliderItemForm } from './add-slider-item-form';
import { DeleteSliderItemAlert } from './delete-slider-item-alert';

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
        const novelty = novedades.find(n => n.id === item.id);
        return { 
            type: 'Novedad', 
            icon: <Newspaper className="h-4 w-4 text-muted-foreground" />,
            originalExists: !!novelty
        };
    }
    return { type: 'Desconocido', icon: null, originalExists: false };
}

interface SliderClientProps {
    initialSliderItems: SliderItem[];
    initialAttractions: Attraction[];
    initialNovedades: Novedad[];
}

export default function SliderClient({ initialSliderItems, initialAttractions, initialNovedades }: SliderClientProps) {
    const [sliderItems] = useState(initialSliderItems);
    const [attractions] = useState(initialAttractions);
    const [novedades] = useState(initialNovedades);
    const [editingItem, setEditingItem] = useState<SliderItem | null>(null);

    const handleEdit = (item: SliderItem) => {
        setEditingItem(item);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    const handleSuccess = () => {
        setEditingItem(null);
        window.location.reload();
    };

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Elementos del Slider Principal</CardTitle>
                        <CardDescription>
                            Esta es la lista de elementos que aparecen en el slider de la página de inicio. Haz clic en el lápiz para editar.
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
                                {sliderItems.map((item, index) => {
                                    const displayData = getItemDisplayData(item, attractions, novedades);
                                    const isEditing = editingItem?.uuid === item.uuid;
                                    return (
                                        <TableRow key={item.uuid} className={isEditing ? 'bg-primary/5' : ''}>
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
                                                <div className="inline-flex items-center">
                                                    {isEditing ? (
                                                        <Button variant="ghost" size="icon" onClick={handleCancelEdit} title="Cancelar">
                                                            <X className="h-4 w-4" />
                                                            <span className="sr-only">Cancelar</span>
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} title="Editar">
                                                                <Pencil className="h-4 w-4" />
                                                                <span className="sr-only">Editar</span>
                                                            </Button>
                                                            <DeleteSliderItemAlert uuid={item.uuid}>
                                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span className="sr-only">Eliminar</span>
                                                                </Button>
                                                            </DeleteSliderItemAlert>
                                                        </>
                                                    )}
                                                </div>
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
                {editingItem ? (
                    <AddSliderItemForm 
                        attractions={attractions} 
                        novedades={novedades} 
                        editingItem={editingItem}
                        onSuccess={handleSuccess}
                        onCancel={handleCancelEdit}
                    />
                ) : (
                    <AddSliderItemForm attractions={attractions} novedades={novedades} />
                )}
            </div>
        </div>
    );
}
