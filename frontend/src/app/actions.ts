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
  revalidatePath('/');
}

export async function deleteSubCategoryAction(subId: number) {
  await privateFetch(`/categories/sub/${subId}`, {
    method: 'DELETE',
  });
  revalidatePath('/');
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

export async function sendFriendRequestAction(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email) return;

  await privateFetch('/friends/requests', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  revalidatePath('/');
}

export async function respondToFriendRequestAction(
  requestId: string,
  action: 'accept' | 'decline',
) {
  await privateFetch(`/friends/requests/${requestId}`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
  revalidatePath('/');
}
