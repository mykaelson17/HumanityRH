"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function ApplyButton({ jobId }: { jobId: string }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleApply = async () => {
    if (!session) {
      router.push(`/candidato/cadastro?jobId=${jobId}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/candidaturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao candidatar");
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="badge badge-success p-3 text-center block w-full text-lg">
        Candidatura Enviada!
      </div>
    );
  }

  return (
    <div>
      <Button 
        variant="primary" 
        fullWidth 
        className="py-3 text-lg" 
        onClick={handleApply}
        disabled={loading}
      >
        {loading ? "Processando..." : "Candidatar-se"}
      </Button>
      {error && <p className="text-danger mt-2 text-sm text-center">{error}</p>}
    </div>
  );
}
