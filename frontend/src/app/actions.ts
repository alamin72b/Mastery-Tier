'use server';

import { privateFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return;

  await privateFetch('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  revalidatePath('/'); // Refreshes the page to show the new data
}

export async function deleteSubCategoryAction(subId: number) {
  await privateFetch(`/categories/sub/${subId}`, {
    method: 'DELETE',
  });
  revalidatePath('/'); // Instantly updates the UI after deletion
}

export async function createSubCategoryAction(
  categoryId: number,
  formData: FormData,
) {
  const name = formData.get('name') as string;
  if (!name) return;

  await privateFetch(`/categories/${categoryId}/sub`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  revalidatePath('/');
}

export async function deleteCategoryAction(categoryId: number) {
  await privateFetch(`/categories/${categoryId}`, {
    method: 'DELETE',
  });
  revalidatePath('/');
}

export async function incrementAction(subId: number) {
  await privateFetch(`/categories/sub/${subId}/increment`, { method: 'PATCH' });
  revalidatePath('/');
}

export async function decrementAction(subId: number) {
  await privateFetch(`/categories/sub/${subId}/decrement`, { method: 'PATCH' });
  revalidatePath('/');
}
