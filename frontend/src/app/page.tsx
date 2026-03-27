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

const featureCards = [
  {
    title: 'Track every subject',
    description:
      'Create subjects and break them into smaller topics so your learning stays organized and easy to review.',
  },
  {
    title: 'Measure mastery clearly',
    description:
      'Increase or decrease topic counts as you practice to reflect your current confidence and progress.',
  },
  {
    title: 'Learn with friends',
    description:
      'Add friends, view their mastery tiers, and stay motivated by seeing how others are progressing.',
  },
  {
    title: 'Keep study progress simple',
    description:
      'Use one clean dashboard to update subjects, track weak areas, and focus on what needs more work.',
  },
];

const steps = [
  'Sign in with Google to open your personal study dashboard.',
  'Add a subject like JavaScript, Biology, IELTS, or any topic you want to master.',
  'Create smaller study topics under each subject and update their counts as you practice.',
  'Review your mastery tiers regularly and compare progress with friends for extra motivation.',
];

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
      <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <section className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="px-6 py-10 sm:px-10 sm:py-14">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Study smarter
                </p>

                <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                  Mastery Tiers helps you track learning progress in a simple,
                  clear, and motivating way.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                  Organize what you are learning into subjects, break them into
                  smaller topics, and measure mastery over time. It is built for
                  students, self-learners, and anyone who wants a better way to
                  see real progress.
                </p>

                <div className="mt-8 max-w-xl rounded-3xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-zinc-900">
                    Start your learning dashboard
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Sign in first to create subjects, update mastery levels, and
                    connect with friends.
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <SignIn />
                    <span className="text-sm font-medium text-zinc-500">
                      Fast sign in with your Google account
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-500">
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
                    Track subjects
                  </span>
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
                    Monitor mastery
                  </span>
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
                    Stay consistent
                  </span>
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
                    Learn with friends
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-200 bg-zinc-900 px-6 py-10 text-zinc-50 lg:border-l lg:border-t-0 sm:px-8">
                <h2 className="text-lg font-semibold">Why this app matters</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  Many learners study regularly but still find it hard to know
                  whether they are truly improving. Mastery Tiers turns that
                  uncertainty into visible progress by making practice easier to
                  record and review.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium text-white">Best for</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Students, self-learners, language learners, exam
                      preparation, and skill-building journeys.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium text-white">
                      Main benefit
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      You can instantly see what is improving, what is weak, and
                      what needs more repetition.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium text-white">
                      Social motivation
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Add friends and compare progress to stay accountable and
                      inspired.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Features
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
                  What users can do inside Mastery Tiers
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-zinc-500">
                The landing page should help first-time visitors quickly
                understand the product and what they can achieve with it.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
                >
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                How to use
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
                Get started in four simple steps
              </h2>

              <div className="mt-6 space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl bg-zinc-50 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-zinc-600">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                What users gain
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
                A clearer picture of real study progress
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 p-5">
                  <p className="text-sm font-semibold text-zinc-900">
                    Visible growth
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Users can easily see which topics are improving and which
                    ones need more repetition.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 p-5">
                  <p className="text-sm font-semibold text-zinc-900">
                    Better focus
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Instead of guessing what to revise next, learners can focus
                    on lower mastery areas first.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 p-5">
                  <p className="text-sm font-semibold text-zinc-900">
                    Social accountability
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Friend connections create motivation and make progress feel
                    more engaging.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 p-5">
                  <p className="text-sm font-semibold text-zinc-900">
                    Simple workflow
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    The app stays lightweight so users can update progress fast
                    without friction.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <footer className="rounded-[28px] border border-zinc-200 bg-white px-6 py-6 shadow-sm sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                  Ready to start?
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                  Mastery Tiers is a study tracking app for organizing subjects,
                  measuring mastery topic by topic, and building consistency
                  over time.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SignIn />
                <span className="text-sm font-medium text-zinc-500">
                  Create your dashboard in one step
                </span>
              </div>
            </div>
          </footer>
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
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                Mastery Tiers
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Organize your subjects, track topic progress, and stay motivated
                by comparing growth with friends.
              </p>
            </div>
            <SignOut />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
          <section>
            <Dashboard categories={categories} />
          </section>
          <aside className="space-y-6">
            <FriendsPanel
              friends={friends}
              incomingRequests={incomingRequests}
              outgoingRequests={outgoingRequests}
              discoverResults={discoverResults}
              initialEmail={emailQuery}
              backendToken={session.backendToken}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
