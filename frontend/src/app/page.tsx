import { auth } from "@/lib/auth";
import { SignIn, SignOut } from "@/components/AuthButtons";
import Image from "next/image";

export default async function Home() {
  // Grab the session securely on the server
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-8 rounded-xl bg-white p-8 shadow-sm dark:bg-zinc-950 dark:border dark:border-zinc-800">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mastery Tiers
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {session ? "Welcome back!" : "Please sign in to view your categories."}
          </p>
        </div>

        {/* Display this table/layout if the user IS logged in */}
        {session?.user ? (
          <div className="flex flex-col items-center gap-4 w-full">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full border border-zinc-200 dark:border-zinc-800"
              />
            )}
            
            <div className="w-full rounded-lg border border-zinc-200 text-sm dark:border-zinc-800">
              <div className="grid grid-cols-3 border-b border-zinc-200 p-3 dark:border-zinc-800">
                <span className="font-medium text-zinc-500">Name</span>
                <span className="col-span-2 text-zinc-900 dark:text-zinc-100">{session.user.name}</span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="font-medium text-zinc-500">Email</span>
                <span className="col-span-2 text-zinc-900 dark:text-zinc-100">{session.user.email}</span>
              </div>
            </div>

            <div className="mt-4 w-full">
              <SignOut />
            </div>
          </div>
        ) : (
          /* Display this if the user IS NOT logged in */
          <div className="w-full flex justify-center mt-4">
            <SignIn />
          </div>
        )}

      </main>
    </div>
  );
}