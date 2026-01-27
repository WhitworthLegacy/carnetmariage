"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, Mail } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate sending — replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSent(true);
    setLoading(false);
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl text-ink tracking-tight">
            Une question ? Écris-nous.
          </h1>
          <p className="mt-4 text-muted text-lg">
            Nous répondons sous 24h.
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl shadow-soft border border-brand-border p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="font-serif text-2xl text-ink mb-2">
              Message envoyé
            </h2>
            <p className="text-muted text-sm">
              Merci pour ton message. Nous te répondrons très vite.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft border border-brand-border p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  Prénom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Marie"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-ivory text-ink placeholder:text-muted-light text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="marie@exemple.fr"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-ivory text-ink placeholder:text-muted-light text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  Ton message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Dis-nous comment on peut t'aider..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-ivory text-ink placeholder:text-muted-light text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={
                  loading ||
                  !form.name.trim() ||
                  !form.email.trim() ||
                  !form.message.trim()
                }
                className="w-full py-3 rounded-xl bg-pink-dark text-white font-medium text-sm hover:bg-pink-main transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Envoyer mon message
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-brand-border">
              <p className="text-sm text-muted text-center flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Tu peux aussi nous écrire à{" "}
                <a
                  href="mailto:contact@carnetmariage.fr"
                  className="text-pink-dark hover:text-pink-main font-medium transition-colors"
                >
                  contact@carnetmariage.fr
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
