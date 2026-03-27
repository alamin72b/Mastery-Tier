import { auth } from '@/lib/auth';

const BASE_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('Backend API URL is not configured');
}

export async function privateFetch(
  endpoint: string,
  options: RequestInit = {},
) {
  const session = await auth();

  if (!session?.backendToken) {
    throw new Error('No authentication token found');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.backendToken}`,
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    throw new Error('Session expired. Please sign in again.');
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : 'Request failed';

    throw new Error(message);
  }

  // Unwrap API fencing { success, statusCode, message, data, ... }
  if (data && typeof data === 'object' && 'data' in data) {
    return (data as { data: unknown }).data;
  }

  return data;
}