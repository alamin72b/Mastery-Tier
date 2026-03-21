import { auth } from '@/lib/auth';
import { privateFetch } from '@/lib/api';
import { SignIn, SignOut } from '@/components/AuthButtons';
import Dashboard from '@/components/Dashboard';

export default async function Home() {
  const session = await auth();

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

  let categories = [];
  try {
    const response = await privateFetch('/categories');
    categories = response.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
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

        <Dashboard categories={categories} />
      </div>
    </main>
  );
}
