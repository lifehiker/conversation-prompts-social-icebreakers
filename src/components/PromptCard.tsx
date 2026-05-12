"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

type DepthLevel = "LIGHT" | "MEDIUM" | "DEEP";

interface Prompt {
  text: string;
  depthLevel: DepthLevel;
  order: number;
}

interface PromptCardProps {
  prompt: Prompt;
  total: number;
  onNext: () => void;
  packName?: string;
}

const depthConfig: Record<DepthLevel, { label: string; color: string }> = {
  LIGHT: { label: "Light", color: "bg-green-100 text-green-800 border-green-200" },
  MEDIUM: { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  DEEP: { label: "Deep", color: "bg-purple-100 text-purple-800 border-purple-200" },
};

export default function PromptCard({ prompt, total, onNext, packName }: PromptCardProps) {
  const [animating, setAnimating] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setTranslateX(-100);
    setTimeout(() => {
      onNext();
      setTranslateX(100);
      setTimeout(() => {
        setTranslateX(0);
        setAnimating(false);
      }, 50);
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animating]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    if (deltaX > 50) {
      handleNext();
    }
    touchStartX.current = null;
  };

  const depth = depthConfig[prompt.depthLevel];

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 cursor-pointer select-none"
      onClick={handleNext}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      aria-label="Tap or swipe to advance to next card"
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 flex flex-col gap-6"
        style={{
          transform: `translateX(${translateX}%)`,
          transition: animating ? "transform 200ms ease-out" : "none",
          opacity: translateX === 0 ? 1 : 0,
        }}
      >
        {packName && (
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{packName}</p>
        )}

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${depth.color}`}>
            {depth.label}
          </span>
        </div>

        <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-snug">
          {prompt.text}
        </p>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-400">Tap or swipe to advance</p>
          <p className="text-sm font-medium text-gray-500">
            {prompt.order} / {total}
          </p>
        </div>
      </div>
    </div>
  );
}
