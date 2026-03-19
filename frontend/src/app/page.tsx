import { auth } from '@/lib/auth';
import { privateFetch } from '@/lib/api';
import { SignIn, SignOut } from '@/components/AuthButtons';

export default async function Home() {
  const session = await auth();

  // 1. GUARD: If no session, don't even call privateFetch
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Mastery Tiers</h1>
        <p className="mb-6 text-zinc-600">
          Track your progress. Please sign in to continue.
        </p>
        <SignIn />
      </div>
    );
  }

  // 2. DATA FETCH: This only runs if the user is authenticated
  let categories = [];
  try {
    const response = await privateFetch('/categories');
    categories = response.data;
  } catch (error) {
    console.error('Fetch error:', error);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
        <SignOut />
      </div>

      <div className="grid gap-4 max-w-2xl">
        {categories.length > 0 ? (
          categories.map((cat: any) => (
            <div
              key={cat.id}
              className="p-4 border rounded-xl bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
            >
              <h2 className="font-bold text-lg">{cat.name}</h2>
              <div className="mt-2 text-sm text-zinc-500">
                Mastery Tier: {cat.masteryTier}
              </div>
            </div>
          ))
        ) : (
          <p className="text-zinc-500 italic">No categories created yet.</p>
        )}
      </div>
    </div>
  );
}
