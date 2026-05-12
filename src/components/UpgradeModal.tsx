"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allPacks = [
  { name: "First Date", count: 50, free: true },
  { name: "Couples Deep Dive", count: 60, free: false },
  { name: "Team Icebreaker", count: 40, free: false },
  { name: "Road Trip", count: 35, free: false },
  { name: "Dinner Party", count: 35, free: false },
  { name: "Old Friends", count: 40, free: false },
];

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState<"LIFETIME" | "FACILITATOR" | null>(null);

  const handleCheckout = async (tier: "LIFETIME" | "FACILITATOR") => {
    setLoading(tier);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Unlock All Packs</DialogTitle>
          <DialogDescription>
            One-time payment. No subscription. All packs, forever.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          {allPacks.map((pack) => (
            <div key={pack.name} className="flex items-center gap-3 py-2">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">{pack.name}</span>
              <span className="text-xs text-gray-400">{pack.count} cards</span>
              {pack.free && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  Free
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <Button
            className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800"
            onClick={() => handleCheckout("LIFETIME")}
            disabled={loading !== null}
          >
            {loading === "LIFETIME" ? "Redirecting..." : "Unlock All Packs — $9.99 once"}
          </Button>

          <button
            className="w-full text-sm text-gray-500 hover:text-gray-700 underline py-2"
            onClick={() => handleCheckout("FACILITATOR")}
            disabled={loading !== null}
          >
            {loading === "FACILITATOR"
              ? "Redirecting..."
              : "Need facilitator mode? $24.99 — includes PDF export & presentation mode"}
          </button>
        </div>

        <p className="text-xs text-center text-gray-400 mt-4">
          Secure checkout via Stripe. Works offline after unlock.
        </p>
      </DialogContent>
    </Dialog>
  );
}
