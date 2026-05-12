"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PromptCard from "@/components/PromptCard";
import UpgradeModal from "@/components/UpgradeModal";

type DepthLevel = "LIGHT" | "MEDIUM" | "DEEP";

interface Prompt {
  id: string;
  text: string;
  depthLevel: DepthLevel;
  order: number;
}

interface Pack {
  id: string;
  slug: string;
  name: string;
  description: string;
  context: string;
  isPremium: boolean;
  cardCount: number;
  prompts: Prompt[];
}

const FREE_PREVIEW_LIMIT = 10;

export default function PackPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasPurchase, setHasPurchase] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);

  // Load pack data
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/packs/${slug}/prompts`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPack(data);
      })
      .catch(() => setError("Failed to load pack"))
      .finally(() => setLoading(false));
  }, [slug]);

  // Check purchase status
  useEffect(() => {
    fetch("/api/user/purchase")
      .then((r) => r.json())
      .then((d) => setHasPurchase(d.hasPurchase === true))
      .catch(() => setHasPurchase(false));
  }, []);

  // Restore saved position
  useEffect(() => {
    if (!pack) return;
    const saved = localStorage.getItem(`prompt_pos_${pack.id}`);
    if (saved) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx > 0 && idx < pack.prompts.length) {
        setCurrentIndex(idx);
      }
    }
  }, [pack]);

  // Save position
  useEffect(() => {
    if (!pack) return;
    localStorage.setItem(`prompt_pos_${pack.id}`, String(currentIndex));
  }, [currentIndex, pack]);

  const canAdvance = useCallback(() => {
    if (!pack) return false;
    if (!pack.isPremium) return true;
    if (hasPurchase) return true;
    return currentIndex < FREE_PREVIEW_LIMIT - 1;
  }, [pack, hasPurchase, currentIndex]);

  const handleNext = () => {
    if (!pack) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex >= pack.prompts.length) return; // end of deck

    if (pack.isPremium && !hasPurchase && nextIndex >= FREE_PREVIEW_LIMIT) {
      setShowUpgrade(true);
      return;
    }
    setCurrentIndex(nextIndex);
  };

  const handleStartRoom = async () => {
    if (!pack) return;
    setCreatingRoom(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: pack.id, packSlug: pack.slug }),
      });
      const data = await res.json();
      if (data.code) {
        router.push(`/room/${data.code}`);
      }
    } catch {
      alert("Failed to create room");
    } finally {
      setCreatingRoom(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Pack not found.</p>
        <Link href="/packs" className="text-blue-600 hover:underline">
          Browse all packs
        </Link>
      </div>
    );
  }

  const currentPrompt = pack.prompts[currentIndex];
  const isLastCard = currentIndex >= pack.prompts.length - 1;
  const isGated = pack.isPremium && !hasPurchase && currentIndex >= FREE_PREVIEW_LIMIT;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/packs" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
          ← Back
        </Link>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">{pack.name}</p>
          <p className="text-xs text-gray-400">{pack.context}</p>
        </div>
        <button
          onClick={handleStartRoom}
          disabled={creatingRoom}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {creatingRoom ? "..." : "Start Together"}
        </button>
      </div>

      {/* Card area */}
      {isGated ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 mb-2">You&apos;ve reached the free preview</p>
            <p className="text-gray-500">Unlock all {pack.cardCount} cards for $9.99 — once, forever.</p>
          </div>
          <button
            onClick={() => setShowUpgrade(true)}
            className="h-12 px-8 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800"
          >
            Unlock All Packs — $9.99
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <PromptCard
            prompt={currentPrompt}
            total={pack.prompts.length}
            onNext={isLastCard ? () => {} : handleNext}
            packName={pack.name}
          />

          {isLastCard && (
            <div className="text-center pb-12 px-6">
              <p className="text-lg font-semibold text-gray-900 mb-2">You finished the pack!</p>
              <button
                onClick={() => setCurrentIndex(0)}
                className="text-sm text-blue-600 hover:underline"
              >
                Start over
              </button>
            </div>
          )}

          {pack.isPremium && !hasPurchase && (
            <div className="px-6 pb-6 text-center">
              <p className="text-xs text-gray-400">
                Card {currentIndex + 1} of {FREE_PREVIEW_LIMIT} free preview cards
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upgrade nudge for non-purchasers on premium packs */}
      {pack.isPremium && !hasPurchase && !isGated && (
        <div className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {FREE_PREVIEW_LIMIT - currentIndex} free cards remaining
          </p>
          <button
            onClick={() => setShowUpgrade(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Unlock all {pack.cardCount} cards →
          </button>
        </div>
      )}

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
