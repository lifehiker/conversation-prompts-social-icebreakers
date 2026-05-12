"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PromptCard from "@/components/PromptCard";

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
  prompts: Prompt[];
}

interface RoomState {
  code: string;
  packId: string;
  packSlug: string;
  currentCardIndex: number;
}

export default function RoomPage() {
  const params = useParams();
  const code = params?.code as string;

  const [room, setRoom] = useState<RoomState | null>(null);
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${code}`);
      if (!res.ok) throw new Error("Room not found");
      const data = await res.json();
      setRoom(data);
      return data;
    } catch (err) {
      setError("Room not found or expired.");
      return null;
    }
  }, [code]);

  // Initial load
  useEffect(() => {
    if (!code) return;

    const init = async () => {
      setLoading(true);
      const roomData = await fetchRoom();
      if (roomData?.packSlug) {
        const packRes = await fetch(`/api/packs/${roomData.packSlug}/prompts`);
        const packData = await packRes.json();
        setPack(packData);
      }
      setLoading(false);
    };

    init();
  }, [code, fetchRoom]);

  // Poll every 2 seconds
  useEffect(() => {
    if (!code || error) return;

    pollRef.current = setInterval(() => {
      fetchRoom();
    }, 2000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [code, error, fetchRoom]);

  const handleNext = async () => {
    if (!room || advancing) return;
    setAdvancing(true);
    try {
      await fetch(`/api/rooms/${code}`, { method: "PATCH" });
      await fetchRoom();
    } finally {
      setAdvancing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading room...</p>
      </div>
    );
  }

  if (error || !room || !pack) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-700 text-lg">{error || "Something went wrong."}</p>
        <Link href="/packs" className="text-blue-600 hover:underline">
          Browse packs
        </Link>
      </div>
    );
  }

  const currentPrompt = pack.prompts[room.currentCardIndex];
  const isLastCard = room.currentCardIndex >= pack.prompts.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/packs" className="text-sm text-gray-500 hover:text-gray-900">
          ← Leave
        </Link>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">{pack.name}</p>
          <p className="text-xs font-mono text-gray-400">Room: {code}</p>
        </div>
        <button
          onClick={handleCopyLink}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          {copied ? "Copied!" : "Invite"}
        </button>
      </div>

      {/* Room info banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-center">
        <p className="text-xs text-blue-700">
          Shared room — either person can advance the card.{" "}
          <button onClick={handleCopyLink} className="underline font-medium">
            Share link
          </button>
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col">
        {currentPrompt ? (
          <PromptCard
            prompt={currentPrompt}
            total={pack.prompts.length}
            onNext={isLastCard ? () => {} : handleNext}
            packName={pack.name}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Deck complete!</p>
          </div>
        )}

        {isLastCard && (
          <div className="text-center pb-8">
            <p className="text-lg font-semibold text-gray-900 mb-2">You finished the deck!</p>
            <Link href="/packs" className="text-blue-600 hover:underline text-sm">
              Browse more packs
            </Link>
          </div>
        )}
      </div>

      {/* Next button */}
      {!isLastCard && (
        <div className="bg-white border-t border-gray-100 p-4">
          <button
            onClick={handleNext}
            disabled={advancing}
            className="w-full h-12 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {advancing ? "Advancing..." : "Next Card →"}
          </button>
        </div>
      )}
    </div>
  );
}
