import { auth } from '@/lib/auth';

// 🛠️ CHANGED: Explicitly use 127.0.0.1 instead of localhost
const BASE_URL = 'http://127.0.0.1:3001';

export async function privateFetch(
  endpoint: string,
  options: RequestInit = {},
) {
  const session = await auth();

  // 1. Check if the session and backendToken exist
  if (!session?.backendToken) {
    throw new Error('No authentication token found');
  }

  // 2. Merge headers with the Authorization Bearer token
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.backendToken}`,
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 3. Handle 401 Unauthorized (Token expired)
  if (response.status === 401) {
    throw new Error('Session expired. Please sign in again.');
  }

  return response.json();
}