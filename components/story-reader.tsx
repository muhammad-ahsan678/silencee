"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { StoryAct } from "@/lib/story-data";

type StoryReaderProps = {
  act: StoryAct;
  previousAct?: StoryAct;
  nextAct?: StoryAct;
};

export default function StoryReader({ act, previousAct, nextAct }: StoryReaderProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [fontScale, setFontScale] = useState(1);

  const currentSlide = act.slides[slideIndex];

  const progressLabel = useMemo(
    () => `${slideIndex + 1} / ${act.slides.length}`,
    [act.slides.length, slideIndex],
  );

  const canGoPrevious = slideIndex > 0;
  const canGoNext = slideIndex < act.slides.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setSlideIndex((value) => value - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setSlideIndex((value) => value + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#f5f0e6]">
      <header className="sticky top-0 z-20 border-b border-[#2d2d2d] bg-[#111111]/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#d3af7d]">
              Silence
            </Link>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-[#a89c8b] sm:inline">
              {act.heading}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#1a1a1a] p-1">
            <button
              type="button"
              onClick={() => setFontScale((value) => Number(Math.max(0.75, Number((value - 0.15).toFixed(2)))))}
              className="h-8 w-8 rounded-full text-lg text-[#f5f0e6] transition hover:bg-[#2b2b2b]"
              aria-label="Decrease text size"
            >
              −
            </button>
            <span className="min-w-14 text-center text-[10px] uppercase tracking-[0.2em] text-[#d3af7d]">
              {fontScale.toFixed(2)}x
            </span>
            <button
              type="button"
              onClick={() => setFontScale((value) => Number(Math.min(1.8, Number((value + 0.15).toFixed(2)))))}
              className="h-8 w-8 rounded-full text-lg text-[#f5f0e6] transition hover:bg-[#2b2b2b]"
              aria-label="Increase text size"
            >
              +
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl flex-col px-4 pb-6 pt-6 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-[#a89c8b]">
          <div>{act.heading}</div>
          <div>{progressLabel}</div>
        </div>

        <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#2f2f2f] bg-[#121212] shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="flex flex-1 flex-col justify-center px-4 py-6 sm:px-8 lg:px-16">
            <div className="mx-auto w-full max-w-5xl" style={{ fontSize: `${fontScale}rem` }}>
              <p className="mb-4 text-[0.5em] uppercase tracking-[0.32em] text-[#d3af7d]">
                {currentSlide.title}
              </p>
              <div className="space-y-5 text-[#f4efe6] leading-relaxed">
                {currentSlide.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={`${currentSlide.title}-${paragraphIndex}`} className="max-w-4xl text-balance">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <nav className="flex items-center justify-between gap-3 border-t border-[#2d2d2d] bg-[#151515] px-4 py-4 sm:px-8">
            <div className="flex items-center gap-2">
              {previousAct ? (
                <Link
                  href={`/act/${previousAct.slug}`}
                  className="rounded-full border border-[#3a3a3a] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#f5f0e6] transition hover:border-[#d3af7d] hover:text-[#d3af7d]"
                >
                  Previous Act
                </Link>
              ) : (
                <Link
                  href="/"
                  className="rounded-full border border-[#3a3a3a] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#f5f0e6] transition hover:border-[#d3af7d] hover:text-[#d3af7d]"
                >
                  Home
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className="rounded-full border border-[#3a3a3a] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#f5f0e6] transition enabled:hover:border-[#d3af7d] enabled:hover:text-[#d3af7d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                className="rounded-full border border-[#d3af7d] bg-[#d3af7d] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#111111] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
              {nextAct && canGoNext === false ? (
                <Link
                  href={`/act/${nextAct.slug}`}
                  className="rounded-full border border-[#d3af7d] bg-[#d3af7d] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#111111] transition hover:brightness-110"
                >
                  Next Act
                </Link>
              ) : null}
            </div>
          </nav>
        </section>
      </main>
    </div>
  );
}
