'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchFriendsSnapshot,
  respondToFriendRequest,
  sendFriendRequest,
} from '@/lib/friends-client';
import { createRealtimeSocket } from '@/lib/realtime-client';
import type {
  DiscoverUser,
  FriendWithProgress,
  IncomingRequest,
  OutgoingRequest,
} from '@/lib/friends.types';

type LiveStatus = 'connecting' | 'connected' | 'disconnected';

export default function FriendsPanel({
  friends: initialFriends,
  incomingRequests: initialIncomingRequests,
  outgoingRequests: initialOutgoingRequests,
  discoverResults: initialDiscoverResults,
  initialEmail = '',
  backendToken,
}: {
  friends: FriendWithProgress[];
  incomingRequests: IncomingRequest[];
  outgoingRequests: OutgoingRequest[];
  discoverResults: DiscoverUser[];
  initialEmail?: string;
  backendToken: string;
}) {
  const [friends, setFriends] = useState(initialFriends);
  const [incomingRequests, setIncomingRequests] = useState(
    initialIncomingRequests,
  );
  const [outgoingRequests, setOutgoingRequests] = useState(
    initialOutgoingRequests,
  );
  const [discoverResults, setDiscoverResults] = useState(
    initialDiscoverResults,
  );
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('connecting');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const socketRef = useRef<ReturnType<typeof createRealtimeSocket> | null>(
    null,
  );

  useEffect(() => {
    setFriends(initialFriends);
  }, [initialFriends]);

  useEffect(() => {
    setIncomingRequests(initialIncomingRequests);
  }, [initialIncomingRequests]);

  useEffect(() => {
    setOutgoingRequests(initialOutgoingRequests);
  }, [initialOutgoingRequests]);

  useEffect(() => {
    setDiscoverResults(initialDiscoverResults);
  }, [initialDiscoverResults]);

  const hasRealtime = useMemo(() => {
    return Boolean(
      backendToken &&
      (process.env.NEXT_PUBLIC_REALTIME_URL || process.env.NEXT_PUBLIC_API_URL),
    );
  }, [backendToken]);

  const resyncPanel = useCallback(async () => {
    if (!backendToken) {
      return;
    }

    try {
      const snapshot = await fetchFriendsSnapshot(backendToken, initialEmail);
      setFriends(snapshot.friends);
      setIncomingRequests(snapshot.incomingRequests);
      setOutgoingRequests(snapshot.outgoingRequests);
      setDiscoverResults(snapshot.discoverResults);
      setFormError(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to refresh friends data';
      setFormError(message);
    }
  }, [backendToken, initialEmail]);

  useEffect(() => {
    if (!hasRealtime) {
      setLiveStatus('disconnected');
      return;
    }

    const socket = createRealtimeSocket(backendToken);
    socketRef.current = socket;
    setLiveStatus('connecting');

    const handleResyncEvent = () => {
      void resyncPanel();
    };

    socket.on('connect', () => {
      setLiveStatus('connected');
      void resyncPanel();
    });

    socket.on('disconnect', () => {
      setLiveStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setLiveStatus('disconnected');
    });

    socket.on('friend.request.created', handleResyncEvent);
    socket.on('friend.request.accepted', handleResyncEvent);
    socket.on('friend.request.declined', handleResyncEvent);
    socket.on('friend.list.changed', handleResyncEvent);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('friend.request.created', handleResyncEvent);
      socket.off('friend.request.accepted', handleResyncEvent);
      socket.off('friend.request.declined', handleResyncEvent);
      socket.off('friend.list.changed', handleResyncEvent);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [backendToken, hasRealtime, resyncPanel]);

  const handleSendFriendRequest = useCallback(
    async (formData: FormData) => {
      const email = String(formData.get('email') ?? '').trim();

      if (!email) {
        setFormError('Email is required');
        return;
      }

      try {
        setIsSendingRequest(true);
        setFormError(null);
        await sendFriendRequest(backendToken, email);
        await resyncPanel();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to send request';
        setFormError(message);
      } finally {
        setIsSendingRequest(false);
      }
    },
    [backendToken, resyncPanel],
  );

  const handleRespondToRequest = useCallback(
    async (requestId: string, action: 'accept' | 'decline') => {
      try {
        setActiveRequestId(requestId);
        setFormError(null);
        await respondToFriendRequest(backendToken, requestId, action);
        await resyncPanel();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to update request';
        setFormError(message);
      } finally {
        setActiveRequestId(null);
      }
    },
    [backendToken, resyncPanel],
  );

  const realtimeBadge = useMemo(() => {
    if (!hasRealtime) {
      return {
        label: 'Realtime unavailable',
        className: 'bg-zinc-100 text-zinc-500',
      };
    }

    if (liveStatus === 'connected') {
      return {
        label: 'Live',
        className: 'bg-emerald-100 text-emerald-700',
      };
    }

    if (liveStatus === 'connecting') {
      return {
        label: 'Connecting...',
        className: 'bg-amber-100 text-amber-700',
      };
    }

    return {
      label: 'Reconnecting...',
      className: 'bg-zinc-100 text-zinc-500',
    };
  }, [hasRealtime, liveStatus]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Friends
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              Add a friend by email
            </h2>
            <p className="text-sm text-zinc-500">
              Search by email, send a request, and unlock shared categories
              after the request is accepted.
            </p>
          </div>

          <span
            className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold ${realtimeBadge.className}`}
          >
            {realtimeBadge.label}
          </span>
        </div>

        <form method="GET" className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="email"
            name="email"
            defaultValue={initialEmail}
            placeholder="Search by email"
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-100"
          />
          <button
            type="submit"
            className="h-11 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Search
          </button>
        </form>

        <form
          action={handleSendFriendRequest}
          className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]"
        >
          <input
            type="email"
            name="email"
            defaultValue={initialEmail}
            placeholder="friend@example.com"
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-100"
            required
          />
          <button
            type="submit"
            disabled={isSendingRequest}
            className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSendingRequest ? 'Sending...' : 'Send request'}
          </button>
        </form>

        {formError && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </p>
        )}

        {discoverResults.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
            <h3 className="text-sm font-semibold text-zinc-800">
              Matching users
            </h3>

            {discoverResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {user.name || 'Unnamed user'}
                  </p>
                  <p className="truncate text-sm text-zinc-500">{user.email}</p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                  {user.isFriend
                    ? 'Friend'
                    : user.hasOutgoingRequest
                      ? 'Request sent'
                      : user.hasIncomingRequest
                        ? 'Check inbox'
                        : 'Available'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">
            Incoming requests
          </h2>

          <div className="mt-4 space-y-3">
            {incomingRequests.length === 0 && (
              <p className="text-sm text-zinc-500">
                No pending requests right now.
              </p>
            )}

            {incomingRequests.map((request) => {
              const isBusy = activeRequestId === request.id;

              return (
                <div
                  key={request.id}
                  className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                >
                  <p className="text-sm font-medium text-zinc-900">
                    {request.sender.name || request.sender.email}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {request.sender.email}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        void handleRespondToRequest(request.id, 'accept')
                      }
                      className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? 'Working...' : 'Accept'}
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        void handleRespondToRequest(request.id, 'decline')
                      }
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Sent requests</h2>

          <div className="mt-4 space-y-3">
            {outgoingRequests.length === 0 && (
              <p className="text-sm text-zinc-500">
                You have not sent any pending requests.
              </p>
            )}

            {outgoingRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-zinc-900">
                  {request.receiver.name || request.receiver.email}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {request.receiver.email}
                </p>
                <p className="mt-2 text-xs text-zinc-400">Pending acceptance</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Friend list</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Categories and sub-categories are only shown for accepted friends.
            </p>
          </div>

          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
            {friends.length} friend{friends.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {friends.length === 0 && (
            <p className="text-sm text-zinc-500">
              No friends yet. Send a request to start sharing progress.
            </p>
          )}

          {friends.map((friend) => (
            <div
              key={friend.id}
              className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
            >
              <div className="border-b border-zinc-200 pb-3">
                <p className="text-base font-semibold text-zinc-900">
                  {friend.name || friend.email}
                </p>
                <p className="mt-1 text-sm text-zinc-500">{friend.email}</p>
              </div>

              <div className="mt-4 space-y-3">
                {friend.categories.length === 0 && (
                  <p className="text-sm text-zinc-500">
                    This friend has no categories yet.
                  </p>
                )}

                {friend.categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-xl border border-zinc-200 bg-white p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {category.name}
                      </h3>

                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                        Tier {category.masteryTier}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {category.children.length === 0 && (
                        <span className="text-xs text-zinc-500">
                          No sub-categories yet.
                        </span>
                      )}

                      {category.children.map((child) => (
                        <span
                          key={child.id}
                          className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700"
                        >
                          {child.name}: {child.count}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
