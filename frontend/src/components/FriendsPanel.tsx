'use client';

import {
  respondToFriendRequestAction,
  sendFriendRequestAction,
} from '@/app/actions';

type DiscoverUser = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  isFriend: boolean;
  hasOutgoingRequest: boolean;
  hasIncomingRequest: boolean;
};

type FriendRequestUser = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
};

type IncomingRequest = {
  id: string;
  createdAt: string;
  sender: FriendRequestUser;
};

type OutgoingRequest = {
  id: string;
  createdAt: string;
  receiver: FriendRequestUser;
};

type FriendCategory = {
  id: number;
  name: string;
  masteryTier: number;
  children: Array<{ id: number; name: string; count: number }>;
};

type FriendWithProgress = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  categories: FriendCategory[];
};

export default function FriendsPanel({
  friends,
  incomingRequests,
  outgoingRequests,
  discoverResults,
  initialEmail = '',
}: {
  friends: FriendWithProgress[];
  incomingRequests: IncomingRequest[];
  outgoingRequests: OutgoingRequest[];
  discoverResults: DiscoverUser[];
  initialEmail?: string;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
            Friends
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Add a friend by email
          </h2>
          <p className="text-sm text-zinc-500">
            Search by email, send a request, and unlock shared categories after
            the request is accepted.
          </p>
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
          action={sendFriendRequestAction}
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
            className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Send request
          </button>
        </form>

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

            {incomingRequests.map((request) => (
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
                    onClick={() =>
                      respondToFriendRequestAction(request.id, 'accept')
                    }
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      respondToFriendRequestAction(request.id, 'decline')
                    }
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
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
                    className="rounded-xl border border-white bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-zinc-900">
                          {category.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Tier {category.masteryTier}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {category.children.map((sub) => (
                        <span
                          key={sub.id}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                        >
                          {sub.name}: {sub.count}
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
