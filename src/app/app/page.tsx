import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prompt — Open the App",
  description: "Conversation cards for real life. Open a pack and start.",
  robots: { index: false },
};

export default function AppPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-gray-900 font-bold text-3xl">P</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">Prompt</h1>
        <p className="text-gray-300 mb-8">
          Conversation cards for real-world social moments.
        </p>

        <div className="space-y-3">
          <Link
            href="/packs/first-date"
            className="block w-full h-12 bg-white text-gray-900 font-semibold rounded-xl flex items-center justify-center hover:bg-gray-100"
          >
            First Date Pack — Free →
          </Link>
          <Link
            href="/packs"
            className="block w-full h-12 border border-gray-700 text-gray-300 font-medium rounded-xl flex items-center justify-center hover:border-gray-500"
          >
            Browse All Packs
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          Add to your home screen for offline access.
        </p>
      </div>
    </div>
  );
}
