"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    // Full page reload to ensure cookies are sent to the server
    // The (app)/layout.tsx will check for weddings and redirect if needed
    window.location.href = "/dashboard";
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="font-serif text-2xl text-ink tracking-tight">
            Carnet<span className="text-pink-dark">Mariage</span>
          </span>
        </Link>
      </div>

      {/* Heading */}
      <h1 className="font-serif text-2xl sm:text-3xl text-ink text-center mb-2">
        Retrouve ton carnet
      </h1>
      <p className="text-muted text-center mb-8 text-sm">
        Connecte-toi pour accéder à ton espace de mariage.
      </p>

      {/* Email + Password Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marie@exemple.fr"
            required
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-ivory text-ink placeholder:text-muted-light text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ton mot de passe"
            required
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-ivory text-ink placeholder:text-muted-light text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !email.trim() || !password}
          className="w-full py-3 rounded-xl bg-pink-dark text-white font-medium text-sm hover:bg-pink-main transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          Se connecter
        </button>
      </form>

      {/* Error */}
      {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

      {/* Link to signup */}
      <p className="mt-8 text-center text-sm text-muted">
        Pas encore de carnet ?{" "}
        <Link
          href="/inscription"
          className="text-pink-dark hover:text-pink-main font-medium transition-colors"
        >
          Crée le tien
        </Link>
      </p>
    </div>
  );
}
