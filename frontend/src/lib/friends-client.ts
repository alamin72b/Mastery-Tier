import type {
  DiscoverUser,
  FriendWithProgress,
  FriendsSnapshot,
  RequestsResponse,
} from './friends.types';

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return baseUrl.replace(/\/$/, '');
}

async function authorizedBrowserFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
    cache: 'no-store',
  });

  let json: unknown = null;

  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const message =
      typeof json === 'object' &&
      json !== null &&
      'message' in json &&
      typeof (json as { message?: unknown }).message === 'string'
        ? (json as { message: string }).message
        : 'Request failed';

    throw new Error(message);
  }

  if (typeof json === 'object' && json !== null && 'data' in json) {
    return (json as { data: T }).data;
  }

  return json as T;
}

export async function fetchFriendsSnapshot(
  token: string,
  emailQuery = '',
): Promise<FriendsSnapshot> {
  const trimmedEmailQuery = emailQuery.trim();

  const [friends, requests, discoverResults] = await Promise.all([
    authorizedBrowserFetch<FriendWithProgress[]>('/friends', token),
    authorizedBrowserFetch<RequestsResponse>('/friends/requests', token),
    trimmedEmailQuery.length > 0
      ? authorizedBrowserFetch<DiscoverUser[]>(
          `/friends/discover?email=${encodeURIComponent(trimmedEmailQuery)}`,
          token,
        )
      : Promise.resolve([] as DiscoverUser[]),
  ]);

  return {
    friends,
    incomingRequests: requests.incoming ?? [],
    outgoingRequests: requests.outgoing ?? [],
    discoverResults,
  };
}

export async function sendFriendRequest(
  token: string,
  email: string,
): Promise<void> {
  await authorizedBrowserFetch('/friends/requests', token, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function respondToFriendRequest(
  token: string,
  requestId: string,
  action: 'accept' | 'decline',
): Promise<void> {
  await authorizedBrowserFetch(`/friends/requests/${requestId}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}
