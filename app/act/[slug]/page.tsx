import Link from "next/link";
import { notFound } from "next/navigation";

import StoryReader from "@/components/story-reader";
import { getStoryActs } from "@/lib/story-data";

export function generateStaticParams() {
  return getStoryActs().map((act) => ({ slug: act.slug }));
}

export default async function ActPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const acts = getStoryActs();
  const actIndex = acts.findIndex((entry) => entry.slug === slug);

  if (actIndex === -1) {
    notFound();
  }

  const act = acts[actIndex];
  const previousAct = acts[actIndex - 1];
  const nextAct = acts[actIndex + 1];

  return (
    <>
      <StoryReader act={act} previousAct={previousAct} nextAct={nextAct} />
      {act.slides.length === 0 ? (
        <div className="flex min-h-screen items-center justify-center bg-[#111111] text-[#f5f0e6]">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d3af7d]">Story not found</p>
            <Link href="/" className="mt-4 inline-block rounded-full border border-[#d3af7d] px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#f5f0e6]">
              Return home
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
