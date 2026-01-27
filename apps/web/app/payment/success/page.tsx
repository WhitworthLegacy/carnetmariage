"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@carnetmariage/ui";
import { CheckCircle, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function verifySession() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // No session — try to recover from stored credentials
        setStatus("error");
        setTimeout(() => router.push("/connexion"), 3000);
        return;
      }

      // Verify wedding exists
      const { data: wedding } = await supabase
        .from("weddings")
        .select("id")
        .limit(1)
        .single();

      if (wedding) {
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        // Wedding not found — could be RLS issue, retry once
        await new Promise((r) => setTimeout(r, 1000));
        const { data: retryWedding } = await supabase
          .from("weddings")
          .select("id")
          .limit(1)
          .single();

        if (retryWedding) {
          setStatus("success");
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          setStatus("error");
          setTimeout(() => router.push("/dashboard"), 3000);
        }
      }
    }

    verifySession();
  }, [router]);

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <Card className="shadow-soft p-8 max-w-md w-full text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 size={48} className="text-pink-main animate-spin mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-ink">
              Validation du paiement...
            </h2>
            <p className="text-muted text-sm">
              Un instant, on prépare votre Carnet Complet.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-ink">
              Paiement confirmé !
            </h2>
            <p className="text-muted text-sm">
              Votre Carnet Complet est prêt. Redirection vers votre dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
              <CheckCircle size={32} className="text-amber-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-ink">
              Paiement reçu
            </h2>
            <p className="text-muted text-sm">
              Redirection en cours...
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
