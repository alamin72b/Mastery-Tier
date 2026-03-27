import { auth } from '@/lib/auth';
import { privateFetch } from '@/lib/api';
import { SignIn, SignOut } from '@/components/AuthButtons';
import Dashboard from '@/components/Dashboard';
import FriendsPanel from '@/components/FriendsPanel';

type Category = {
  id: number;
  name: string;
  userId: string;
  masteryTier: number;
  children: Array<{
    id: number;
    name: string;
    count: number;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

type FriendCategory = {
  id: number;
  name: string;
  userId: string;
  masteryTier: number;
  children: Array<{
    id: number;
    name: string;
    count: number;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

type Friend = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  friendedAt: string;
  categories: FriendCategory[];
};

type FriendRequestUser = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
};

type IncomingRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  sender: FriendRequestUser;
};

type OutgoingRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  receiver: FriendRequestUser;
};

type RequestsResponse = {
  incoming: IncomingRequest[];
  outgoing: OutgoingRequest[];
};

type DiscoverUser = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  isFriend: boolean;
  hasOutgoingRequest: boolean;
  hasIncomingRequest: boolean;
};

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string }>;
}) {
  const session = await auth();
  const resolvedSearchParams = await searchParams;
  const emailQuery = resolvedSearchParams?.email?.trim() || '';

  if (!session || !session.backendToken) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[28px] border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Mastery Tiers
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
              {session
                ? 'Your login was interrupted. Please sign out and try again.'
                : 'Sign in to track your study progress.'}
            </p>
            <div className="mt-8 flex justify-center">
              {session ? <SignOut /> : <SignIn />}
            </div>
          </div>
        </div>
      </main>
    );
  }

  let categories: Category[] = [];
  let friends: Friend[] = [];
  let incomingRequests: IncomingRequest[] = [];
  let outgoingRequests: OutgoingRequest[] = [];
  let discoverResults: DiscoverUser[] = [];

  try {
    const [
      categoriesResponse,
      friendsResponse,
      requestsResponse,
      discoverResponse,
    ] = (await Promise.all([
      privateFetch('/categories'),
      privateFetch('/friends'),
      privateFetch('/friends/requests'),
      emailQuery
        ? privateFetch(
            `/friends/discover?email=${encodeURIComponent(emailQuery)}`,
          )
        : Promise.resolve([] as DiscoverUser[]),
    ])) as [Category[], Friend[], RequestsResponse, DiscoverUser[]];

    if (Array.isArray(categoriesResponse)) {
      categories = categoriesResponse;
    } else if (
      categoriesResponse &&
      typeof categoriesResponse === 'object' &&
      'data' in categoriesResponse &&
      Array.isArray((categoriesResponse as { data: unknown }).data)
    ) {
      categories = (categoriesResponse as { data: Category[] }).data;
    } else {
      categories = [];
    }

    if (Array.isArray(friendsResponse)) {
      friends = friendsResponse;
    } else if (
      friendsResponse &&
      typeof friendsResponse === 'object' &&
      'data' in friendsResponse &&
      Array.isArray((friendsResponse as { data: unknown }).data)
    ) {
      friends = (friendsResponse as { data: Friend[] }).data;
    } else {
      friends = [];
    }

    incomingRequests = requestsResponse.incoming || [];
    outgoingRequests = requestsResponse.outgoing || [];
    discoverResults = discoverResponse;
  } catch (error) {
    console.error('Fetch error:', error);
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-[28px] border border-zinc-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                Study Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
                Welcome, {session.user?.name}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Track your exam preparation clearly and consistently
              </p>
            </div>

            <div className="shrink-0">
              <SignOut />
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Dashboard categories={categories} />
          <FriendsPanel
            friends={friends}
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            discoverResults={discoverResults}
            initialEmail={emailQuery}
          />
        </div>
      </div>
    </main>
  );
}
