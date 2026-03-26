'use client';

import {
  createCategoryAction,
  createSubCategoryAction,
  incrementAction,
  decrementAction,
  deleteSubCategoryAction,
  deleteCategoryAction,
} from '@/app/actions';

export default function Dashboard({ categories = [] }: { categories: any[] }) {
  return (
    <div className="space-y-6">
      <form
        action={createCategoryAction}
        className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            name="name"
            placeholder="Add a subject (e.g. Next.js)"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-100"
            required
          />
          <button
            type="submit"
            className="h-11 w-full sm:w-auto rounded-xl bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.98]"
          >
            Add Subject
          </button>
        </div>
      </form>

      {categories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-14 text-center">
          <h3 className="text-base font-semibold text-zinc-900">
            No subjects yet
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            Add your first subject to start tracking your study progress.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {categories.map((category) => (
          <section
            key={category.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-zinc-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-bold tracking-tight text-zinc-900">
                    {category.name}
                  </h2>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${category.name}" and all of its topics?`,
                        )
                      ) {
                        deleteCategoryAction(category.id);
                      }
                    }}
                    className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-100"
                    title="Delete Entire Category"
                  >
                    Delete
                  </button>
                </div>

                <p className="mt-1 text-sm text-zinc-500">
                  Organize and review your study topics
                </p>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                  Tier {category.masteryTier}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {category.children?.map((sub: any) => (
                <div
                  key={sub.id}
                  className="group/sub flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 px-3 py-2.5 transition hover:border-zinc-200 hover:bg-white"
                >
                  <div className="min-w-0 flex-1 pl-1">
                    <span className="block truncate text-sm font-medium text-zinc-800">
                      {sub.name}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                    <button
                      onClick={() => decrementAction(sub.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-base font-semibold text-zinc-600 transition hover:bg-zinc-100 active:scale-95"
                      title="Decrease Mastery"
                    >
                      −
                    </button>

                    <div className="flex w-7 justify-center text-sm font-semibold text-zinc-900 sm:w-8">
                      {sub.count}
                    </div>

                    <button
                      onClick={() => incrementAction(sub.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-base font-semibold text-zinc-600 transition hover:bg-zinc-100 active:scale-95"
                      title="Increase Mastery"
                    >
                      +
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to delete this topic?',
                          )
                        ) {
                          deleteSubCategoryAction(sub.id);
                        }
                      }}
                      className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-sm text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Delete Topic"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form
              action={createSubCategoryAction.bind(null, category.id)}
              className="mt-5 border-t border-zinc-100 pt-4"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  type="text"
                  name="name"
                  placeholder="Add a new topic..."
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-100"
                  required
                />
                <button
                  type="submit"
                  className="h-10 w-full sm:w-auto rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98]"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </section>
        ))}
      </div>
    </div>
  );
}
