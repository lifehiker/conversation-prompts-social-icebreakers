"use client";

import { useState } from "react";
import PromptCard from "@/components/PromptCard";
import UpgradeModal from "@/components/UpgradeModal";

type DepthLevel = "LIGHT" | "MEDIUM" | "DEEP";

interface Prompt {
  id: string;
  text: string;
  depthLevel: DepthLevel;
  order: number;
}

interface FreeCardPreviewProps {
  prompts: Prompt[];
  packName: string;
  totalCards: number;
}

export default function FreeCardPreview({ prompts, packName, totalCards }: FreeCardPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleNext = () => {
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowUpgrade(true);
    }
  };

  if (!prompts.length) return null;

  const current = prompts[currentIndex];

  return (
    <div className="w-full">
      <PromptCard
        prompt={current}
        total={totalCards}
        onNext={handleNext}
        packName={packName}
      />

      <div className="flex justify-center gap-2 mt-4">
        {prompts.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? "bg-gray-900" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>

      {totalCards > prompts.length && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 mb-3">
            Showing {prompts.length} of {totalCards} cards
          </p>
          <button
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
            onClick={() => setShowUpgrade(true)}
          >
            Unlock all {totalCards} cards →
          </button>
        </div>
      )}

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
