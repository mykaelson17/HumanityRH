"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  User, Mail, Lock, Phone, MapPin, CreditCard,
  Calendar, FileUp, Eye, EyeOff, ChevronRight, 
  Check, BriefcaseBusiness, Trash2, Home
} from "lucide-react";

const STEPS = ["Acesso", "Dados Pessoais", "Endereço", "Currículo"];

export default function CadastroCandidato() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    birthDate: "",
    phone: "",
    cep: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const formatCPF = (v: string) =>
    v.replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

  const formatCEP = (v: string) =>
    v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{3})\d+?$/, "$1");

  const formatPhone = (v: string) =>
    v.replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "cpf") val = formatCPF(value);
    if (name === "cep") val = formatCEP(value);
    if (name === "phone") val = formatPhone(value);
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleCepBlur = async () => {
    const nums = formData.cep.replace(/\D/g, "");
    if (nums.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${nums}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            address: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setResumeFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") setResumeFile(file);
  };

  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (!formData.password || formData.password.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("As senhas não coincidem.");
        return false;
      }
      if (!formData.email) { setError("E-mail obrigatório."); return false; }
    }
    if (step === 1) {
      if (!formData.name) { setError("Nome completo obrigatório."); return false; }
      if (formData.cpf.length < 14) { setError("CPF inválido."); return false; }
      if (!formData.birthDate) { setError("Data de nascimento obrigatória."); return false; }
      if (!formData.phone) { setError("Telefone obrigatório."); return false; }
    }
    if (step === 2) {
      if (formData.cep.length < 9) { setError("CEP inválido."); return false; }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => form.append(k, v as string));
      if (resumeFile) form.append("resume", resumeFile);

      const res = await fetch("/api/candidato", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao realizar cadastro");

      await signIn("credentials", {
        login: formData.cpf,
        password: formData.password,
        redirect: false,
      });

      router.push("/candidato/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputField = (
    name: keyof typeof formData,
    label: string,
    type: string,
    icon: React.ReactNode,
    extra?: object
  ) => (
    <div className="input-group" style={{ margin: 0 }}>
      <label className="input-label">{label}</label>
      <div className="input-with-icon">
        <span className="input-icon">{icon}</span>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="input-field"
          {...extra}
        />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 40%, #F8F7FF 100%)",
    }}>
      {/* LEFT PANEL */}
      <div style={{
        display: "none",
        flexDirection: "column",
        justifyContent: "center",
        padding: "3rem",
        background: "var(--brand-gradient)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
        className="hidden"
        id="register-left-panel"
      >
        {/* Decorative circles */}
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%", background: "rgba(255,255,255,0.05)",
          top: "-100px", right: "-100px",
        }} />
        <div style={{
          position: "absolute", width: "300px", height: "300px",
          borderRadius: "50%", background: "rgba(255,255,255,0.07)",
          bottom: "-80px", left: "-80px",
        }} />

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "3rem", color: "white", textDecoration: "none" }}>
          <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BriefcaseBusiness size={20} color="white" />
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>MaisEmprego<span style={{ color: "#FB923C" }}>.aux</span></span>
        </Link>

        <div style={{ zIndex: 1 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem" }}>
            Encontre a vaga<br />dos seus sonhos
          </h1>
          <p style={{ fontSize: "1rem", opacity: 0.85, lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Cadastre seu currículo gratuitamente e candidate-se a milhares de vagas em todo o Brasil.
          </p>

          {[
            "Cadastro 100% gratuito",
            "Candidate-se com um clique",
            "Acompanhe seu processo seletivo",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={13} color="white" />
              </div>
              <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL (form) */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2rem 1.5rem",
        overflowY: "auto",
      }}>
        {/* Logo mobile */}
        <div style={{ width: "100%", maxWidth: "520px", marginBottom: "1.5rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: "32px", height: "32px", background: "var(--brand-gradient)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BriefcaseBusiness size={18} color="white" />
            </div>
            MaisEmprego<span style={{ color: "var(--brand-accent)" }}>.aux</span>
          </Link>
        </div>

        <div style={{
          width: "100%", maxWidth: "520px",
          background: "white",
          borderRadius: "var(--border-radius-xl)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-color)",
          padding: "2rem 2rem 2.25rem",
          animation: "fadeIn 0.4s ease",
        }}>
          {/* Header do form */}
          <div style={{ marginBottom: "1.75rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
              Criar conta grátis
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Preencha os dados abaixo para começar.
            </p>
          </div>

          {/* Step Indicator */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1.75rem", gap: "0" }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                  <div style={{
                    width: "28px", height: "28px",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 700,
                    flexShrink: 0,
                    background: i < step ? "var(--success)" : i === step ? "var(--brand-gradient)" : "var(--bg-tertiary)",
                    color: i <= step ? "white" : "var(--text-tertiary)",
                    border: i === step ? "none" : "1.5px solid transparent",
                    transition: "all 0.3s",
                    boxShadow: i === step ? "var(--shadow-brand-sm)" : "none",
                  }}>
                    {i < step ? <Check size={13} /> : i + 1}
                  </div>
                  <span style={{ fontSize: "0.65rem", fontWeight: i === step ? 700 : 500, color: i === step ? "var(--brand-primary)" : "var(--text-tertiary)", whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: "2px", margin: "0 0.25rem", marginBottom: "1rem",
                    background: i < step ? "var(--brand-primary)" : "var(--border-color)",
                    transition: "background 0.3s",
                  }} />
                )}
              </div>
            ))}
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

          <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>

            {/* STEP 0 — Acesso */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", animation: "fadeIn 0.3s ease" }}>
                {inputField("email", "E-mail *", "email", <Mail size={16} />, { required: true, placeholder: "seu@email.com" })}
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Senha * (mínimo 6 caracteres)</label>
                  <div className="input-with-icon" style={{ position: "relative" }}>
                    <span className="input-icon"><Lock size={16} /></span>
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      style={{ paddingRight: "2.75rem" }}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex", alignItems: "center" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Confirmar Senha *</label>
                  <div className="input-with-icon" style={{ position: "relative" }}>
                    <span className="input-icon"><Lock size={16} /></span>
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      style={{ paddingRight: "2.75rem" }}
                    />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex", alignItems: "center" }}>
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1 — Dados Pessoais */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", animation: "fadeIn 0.3s ease" }}>
                {inputField("name", "Nome Completo *", "text", <User size={16} />, { required: true, placeholder: "Como consta no seu documento" })}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">CPF *</label>
                    <div className="input-with-icon">
                      <span className="input-icon"><CreditCard size={16} /></span>
                      <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="input-field" required placeholder="000.000.000-00" maxLength={14} />
                    </div>
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">Data de Nasc. *</label>
                    <div className="input-with-icon">
                      <span className="input-icon"><Calendar size={16} /></span>
                      <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="input-field" required />
                    </div>
                  </div>
                </div>
                {inputField("phone", "Telefone / WhatsApp *", "tel", <Phone size={16} />, { required: true, placeholder: "(00) 00000-0000" })}
              </div>
            )}

            {/* STEP 2 — Endereço */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.875rem" }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">CEP *</label>
                    <div className="input-with-icon">
                      <span className="input-icon"><MapPin size={16} /></span>
                      <input type="text" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} className="input-field" required placeholder="00000-000" maxLength={9} />
                    </div>
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">Rua / Logradouro</label>
                    <div className="input-with-icon">
                      <span className="input-icon"><Home size={16} /></span>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" />
                    </div>
                  </div>
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Bairro</label>
                  <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="input-field" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.875rem" }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">Cidade</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">UF</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="input-field" maxLength={2} style={{ textTransform: "uppercase" }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Currículo */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: "fadeIn 0.3s ease" }}>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                    Anexar Currículo (PDF) — opcional
                  </p>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragOver ? "var(--brand-primary)" : resumeFile ? "var(--success)" : "var(--border-color)"}`,
                      borderRadius: "var(--border-radius-lg)",
                      padding: "2rem",
                      textAlign: "center",
                      cursor: "pointer",
                      background: dragOver ? "var(--brand-primary-light)" : resumeFile ? "var(--success-bg)" : "var(--bg-tertiary)",
                      transition: "var(--transition)",
                    }}
                  >
                    {resumeFile ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={22} color="white" />
                        </div>
                        <p style={{ fontWeight: 700, color: "var(--success)", fontSize: "0.9rem" }}>{resumeFile.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", color: "var(--danger)", background: "none", border: "none", cursor: "pointer", marginTop: "0.25rem" }}
                        >
                          <Trash2 size={14} /> Remover
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.625rem" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--brand-primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FileUp size={22} color="var(--brand-primary)" />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                            {dragOver ? "Solte aqui!" : "Arraste seu currículo"}
                          </p>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>ou clique para selecionar um PDF</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
                </div>

                <div style={{ padding: "1rem", background: "var(--bg-tertiary)", borderRadius: "var(--border-radius-md)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  💡 Você também pode adicionar experiências e formações manualmente no seu painel.
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <input type="checkbox" id="lgpd" required style={{ marginTop: "2px", accentColor: "var(--brand-primary)", width: "15px", height: "15px", cursor: "pointer" }} />
                  <label htmlFor="lgpd" style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5, cursor: "pointer" }}>
                    Li e concordo com a{" "}
                    <span style={{ color: "var(--brand-primary)", fontWeight: 600 }}>Política de Privacidade</span>
                    {" "}e os{" "}
                    <span style={{ color: "var(--brand-primary)", fontWeight: 600 }}>Termos de Uso</span>.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem" }}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    flex: "0 0 auto",
                    padding: "0.7rem 1.25rem",
                    borderRadius: "var(--border-radius-md)",
                    border: "1.5px solid var(--border-color)",
                    background: "white",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
                >
                  Voltar
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "0.75rem",
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
                onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {loading ? (
                  <>
                    <div className="spinner" /> Criando conta...
                  </>
                ) : step < STEPS.length - 1 ? (
                  <>
                    Continuar <ChevronRight size={16} />
                  </>
                ) : (
                  <>
                    Finalizar Cadastro <Check size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
            Já tem conta?{" "}
            <Link href="/candidato/login" style={{ color: "var(--brand-primary)", fontWeight: 700, textDecoration: "none" }}>
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
