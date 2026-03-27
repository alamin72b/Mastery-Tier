'use client';

import { io, type Socket } from 'socket.io-client';

export type RealtimeSocket = Socket;

function getRealtimeBaseUrl() {
  const baseUrl =
    process.env.NEXT_PUBLIC_REALTIME_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error(
      'NEXT_PUBLIC_REALTIME_URL or NEXT_PUBLIC_API_URL must be configured',
    );
  }

  return baseUrl.replace(/\/$/, '');
}

export function createRealtimeSocket(token: string): RealtimeSocket {
  return io(`${getRealtimeBaseUrl()}/realtime`, {
    transports: ['websocket'],
    auth: {
      token,
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    withCredentials: true,
  });
}