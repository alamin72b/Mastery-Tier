import { signIn, signOut } from '@/lib/auth';

export function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        Sign in with Google
      </button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
      >
        Sign Out
      </button>
    </form>
  );
}
