"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, BriefcaseBusiness, Check, ArrowRight } from "lucide-react";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { login, password, redirect: false });

    if (res?.error) {
      setError("E-mail, CPF ou senha incorretos. Tente novamente.");
      setLoading(false);
    } else {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (sessionData?.user?.role && sessionData.user.role !== "CANDIDATE") {
          router.push("/admin/dashboard");
        } else {
          router.push("/candidato/dashboard");
        }
      } catch {
        router.push("/candidato/dashboard");
      }
      router.refresh();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 40%, #F8F7FF 100%)",
    }}>
      {/* LEFT — Branding */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3rem",
        background: "var(--brand-gradient)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        minWidth: "400px",
        maxWidth: "480px",
      }}
        className="hidden"
        id="login-brand-panel"
      >
        {/* Decorações */}
        <div style={{ position: "absolute", width: "360px", height: "360px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: "-80px", right: "-80px" }} />
        <div style={{ position: "absolute", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", bottom: "60px", left: "-80px" }} />

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white", textDecoration: "none", position: "relative", zIndex: 1 }}>
          <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BriefcaseBusiness size={20} color="white" />
          </div>
          MaisEmprego<span style={{ fontSize: "1.25rem", fontWeight: 800, color: "white" }}><span style={{ color: "#FB923C" }}>.aux</span></span>
        </Link>

        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem" }}>
            Bem-vindo<br />de volta!
          </h2>
          <p style={{ fontSize: "1rem", opacity: 0.85, lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Acesse sua conta e continue sua jornada rumo à vaga ideal.
          </p>

          {[
            "Candidate-se a vagas com um clique",
            "Acompanhe seu processo seletivo",
            "Currículo salvo com segurança",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={12} color="white" />
              </div>
              <span style={{ fontSize: "0.875rem", opacity: 0.9 }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "0.8rem", opacity: 0.6, zIndex: 1 }}>
          © {new Date().getFullYear()} MaisEmprego.aux. Todos os direitos reservados.
        </div>
      </div>

      {/* RIGHT — Form */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}>
        {/* Logo mobile */}
        <div style={{ marginBottom: "1.75rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--brand-gradient)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BriefcaseBusiness size={20} color="white" />
            </div>
            MaisEmprego<span style={{ color: "var(--brand-accent)" }}>.aux</span>
          </Link>
        </div>

        <div style={{
          width: "100%", maxWidth: "420px",
          background: "white",
          borderRadius: "var(--border-radius-xl)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-color)",
          padding: "2.25rem 2rem",
          animation: "fadeIn 0.4s ease",
        }}>
          {/* Header */}
          <div style={{ marginBottom: "1.75rem" }}>
            <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>
              Entrar na conta
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Use seu CPF ou e-mail para acessar.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "0.75rem 1rem",
              borderRadius: "var(--border-radius-md)",
              background: "var(--danger-bg)",
              color: "var(--danger)",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
              border: "1px solid #FECACA",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Email/CPF */}
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" htmlFor="login-input">CPF ou E-mail</label>
              <div className="input-with-icon">
                <span className="input-icon"><Mail size={16} /></span>
                <input
                  id="login-input"
                  type="text"
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="input-field"
                  placeholder="seu@email.com ou 000.000.000-00"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="input-group" style={{ margin: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="input-label" htmlFor="password-input">Senha</label>
                <span style={{ fontSize: "0.75rem", color: "var(--brand-primary)", fontWeight: 600, cursor: "pointer" }}>
                  Esqueceu a senha?
                </span>
              </div>
              <div className="input-with-icon" style={{ position: "relative" }}>
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="password-input"
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  style={{ paddingRight: "2.75rem" }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex", alignItems: "center" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "0.5rem",
                padding: "0.8rem",
                borderRadius: "var(--border-radius-md)",
                background: "var(--brand-gradient)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.9375rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
                boxShadow: "var(--shadow-brand-sm)",
                transition: "var(--transition)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              }}
              onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-brand)"; } }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-brand-sm)"; }}
            >
              {loading ? (
                <>
                  <div className="spinner" /> Entrando...
                </>
              ) : (
                <>
                  Entrar <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
            Não tem conta?{" "}
            <Link href="/candidato/cadastro" style={{ color: "var(--brand-primary)", fontWeight: 700, textDecoration: "none" }}>
              Cadastre-se grátis
            </Link>
          </div>
        </div>

        <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-tertiary)", textAlign: "center" }}>
          Acesso RH/Admin:{" "}
          <span style={{ fontFamily: "monospace", background: "var(--bg-tertiary)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
            admin@humanity.com
          </span>
        </p>
      </div>
    </div>
  );
}
