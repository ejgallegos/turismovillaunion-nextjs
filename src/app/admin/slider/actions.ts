'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSliderItems, saveSliderItems, SliderItem } from '@/lib/slider.service';
import { randomUUID } from 'crypto';

const sliderItemSchema = z.object({
  type: z.enum(['atractivo', 'novedad']),
  id: z.string().min(1, 'Debe seleccionar un elemento.'),
});

export async function addSliderItem(formData: FormData) {
  const rawData = {
    type: formData.get('type'),
    id: formData.get('id'),
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
