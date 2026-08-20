"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        
        if (sessionData?.user?.role && sessionData.user.role !== "CANDIDATE") {
          router.push("/admin/dashboard");
        } else {
          router.push("/candidato/dashboard");
        }
      } catch (err) {
        router.push("/candidato/dashboard");
      }
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-tertiary)" }}>
      <Header />
      <div className="container" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 0" }}>
        <Card className="w-full max-w-md" style={{ maxWidth: '400px', width: '100%' }}>
          <h1 className="text-2xl font-bold text-center mb-6">Acesso do Candidato</h1>
          
          {error && (
            <div className="badge badge-danger mb-4" style={{ display: 'block', textAlign: 'center', padding: '0.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="input-group">
              <label className="input-label" htmlFor="login">CPF ou E-mail</label>
              <input
                id="login"
                type="text"
                required
                className="input-field"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                required
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <Button type="submit" variant="primary" fullWidth className="mt-2">
              Entrar com Email
            </Button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            <p className="mb-2">Acesso Admin/RH: use admin@humanity.com / 123456</p>
            <p>
              Não tem conta? <Link href="/candidato/cadastro" className="text-brand font-medium">Cadastre-se</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
