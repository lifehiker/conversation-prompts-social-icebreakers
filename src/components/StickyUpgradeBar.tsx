"use client";

import { useState } from "react";
import UpgradeModal from "@/components/UpgradeModal";

export default function StickyUpgradeBar() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-4 py-3 flex items-center justify-between z-50 shadow-lg">
        <p className="text-sm">
          <span className="font-semibold">Unlock all 6 packs</span>
          <span className="text-gray-300"> — $9.99 once. No subscription.</span>
        </p>
        <button
          onClick={() => setShowUpgrade(true)}
          className="ml-4 text-sm font-semibold bg-white text-gray-900 px-4 py-1.5 rounded-full hover:bg-gray-100 flex-shrink-0"
        >
          Unlock →
        </button>
      </div>
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
