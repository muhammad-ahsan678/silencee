import Link from "next/link";

import { getStoryActs } from "@/lib/story-data";

export default function Home() {
  const acts = getStoryActs();

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-[#f5f0e6]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-8 lg:px-12">
        <header className="border-b border-[#2b2b2b] pb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d3af7d]">A reading experience</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight text-[#f2ebdf] sm:text-5xl">
            The Silence: The Extended Chronicle
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#b9b1a6]">
            A dark, intimate story of grief, guilt, love, and the slow work of becoming whole again.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {acts.map((act) => (
            <Link
              key={act.slug}
              href={`/act/${act.slug}`}
              className="group rounded-2xl border border-[#2a2a2a] bg-[#161616] p-5 transition hover:-translate-y-0.5 hover:border-[#d3af7d] hover:bg-[#191919]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#d3af7d]">
                  {act.heading}
                </span>
                <span className="rounded-full border border-[#3a3a3a] px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-[#b9b1a6]">
                  read
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-medium text-[#f4efe6]">{act.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#c3b7aa]">{act.summary}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
