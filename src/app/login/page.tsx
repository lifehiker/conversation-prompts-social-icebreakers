"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegister) {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/packs");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <Link href="/" className="text-xl font-bold text-gray-900 block mb-8">
          Prompt
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isRegister ? "Create account" : "Sign in"}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {isRegister
            ? "Create an account to access your unlocked packs."
            : "Sign in to access your unlocked packs."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => { setIsRegister(!isRegister); setError(""); }}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          {isRegister ? "Already have an account? Sign in" : "No account? Create one"}
        </button>

        <p className="text-xs text-center text-gray-400 mt-6">
          You only need an account after purchasing.{" "}
          <Link href="/packs/first-date" className="underline hover:text-gray-600">
            Try the free pack first.
          </Link>
        </p>
      </div>
    </div>
  );
}
