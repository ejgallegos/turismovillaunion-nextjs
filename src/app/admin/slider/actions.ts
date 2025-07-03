'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSliderItems, saveSliderItems, SliderItem } from '@/lib/slider.service';
import { randomUUID } from 'crypto';

const sliderItemSchema = z.object({
  type: z.enum(['atractivo', 'novedad']),
  id: z.string().min(1, 'Debe seleccionar un elemento.'),
  title: z.string().min(3, 'El título es requerido.'),
  subtitle: z.string().min(10, 'El subtítulo es requerido.'),
});

export async function addSliderItem(formData: FormData) {
  const rawData = {
    type: formData.get('type'),
    id: formData.get('id'),
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
  };

  const validatedFields = sliderItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const sliderItems = await getSliderItems();
    
    const newItem: SliderItem = {
      uuid: randomUUID(),
      type: validatedFields.data.type,
      id: validatedFields.data.id,
      title: validatedFields.data.title,
      subtitle: validatedFields.data.subtitle,
    };

    sliderItems.push(newItem);
    await saveSliderItems(sliderItems);
    
    revalidatePath('/admin/slider');
    revalidatePath('/');
    
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Error al guardar el elemento del slider.' };
  }
}

export async function deleteSliderItem(uuid: string) {
    if (!uuid) {
        return { success: false, error: 'UUID es requerido.' };
    }
    try {
      const sliderItems = await getSliderItems();
      const updatedItems = sliderItems.filter((item) => item.uuid !== uuid);
      
      await saveSliderItems(updatedItems);

      revalidatePath('/admin/slider');
      revalidatePath('/');
      
      return { success: true };
    } catch (e) {
       return { success: false, error: 'Error al eliminar el elemento del slider.' };
    }
}


export async function moveSliderItem(uuid: string, direction: 'up' | 'down') {
  if (!uuid || !direction) {
    return { success: false, error: 'UUID y dirección son requeridos.' };
  }

  try {
    const sliderItems = await getSliderItems();
    const index = sliderItems.findIndex((item) => item.uuid === uuid);

    if (index === -1) {
      return { success: false, error: 'Elemento no encontrado.' };
    }

    if (direction === 'up' && index > 0) {
      // Swap with the previous item
      [sliderItems[index], sliderItems[index - 1]] = [sliderItems[index - 1], sliderItems[index]];
    } else if (direction === 'down' && index < sliderItems.length - 1) {
      // Swap with the next item
      [sliderItems[index], sliderItems[index + 1]] = [sliderItems[index + 1], sliderItems[index]];
    } else {
        // Can't move further up or down, just return success without doing anything
        return { success: true }; 
    }

    await saveSliderItems(sliderItems);

    revalidatePath('/admin/slider');
    revalidatePath('/');

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Error al reordenar el elemento del slider.' };
  }
}
