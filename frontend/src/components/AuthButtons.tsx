import { signIn, signOut } from "@/lib/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google"); // Triggers the Google OAuth flow
      }}
    >
      <button 
        type="submit" 
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
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
        "use server";
        await signOut(); // Clears the session cookie
      }}
    >
      <button 
        type="submit" 
        className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
      >
        Sign Out
      </button>
    </form>
  );
}