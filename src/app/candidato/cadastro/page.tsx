"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Trash2 } from "lucide-react";

export default function CadastroCandidato() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    age: "", // Kept just in case, but birthDate is better
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cpf') formattedValue = formatCPF(value);
    if (name === 'cep') formattedValue = formatCEP(value);

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleCepBlur = async () => {
    const cepNumbers = formData.cep.replace(/\D/g, '');
    if (cepNumbers.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || ""
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.cpf.length < 14) {
      setError("Digite um CPF válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value as string);
      });
      if (resumeFile) form.append("resume", resumeFile);

      const res = await fetch("/api/candidato", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao realizar cadastro");
      }

      // Log in automatically using CPF
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

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-tertiary)" }}>
      <Header />
      <div className="container" style={{ flex: 1, padding: "1rem 0", display: "flex", justifyContent: "center" }}>
        <Card className="w-full" style={{ maxWidth: '1000px', width: '95%', padding: '2rem 3rem' }}>
          <div className="mb-4 text-center">
            <h1 className="text-xl font-bold mb-1">Cadastro Rápido de Currículo</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Preencha seus dados e anexe seu currículo para se candidatar às vagas.
            </p>
          </div>

          {error && (
            <div className="badge badge-danger mb-2" style={{ display: 'block', textAlign: 'center', padding: '0.4rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* DADOS PESSOAIS */}
            <h3 className="font-bold text-base border-b pb-1 mt-1">Dados Pessoais</h3>
            
            <div className="grid md:grid-cols-3 gap-4 mt-1">
              <div className="input-group m-0 md:col-span-1">
                <label className="input-label text-xs">Nome Completo *</label>
                <input type="text" name="name" required className="input-field w-full py-1" value={formData.name} onChange={handleChange} />
              </div>
              <div className="input-group m-0 md:col-span-1">
                <label className="input-label text-xs">CPF *</label>
                <input type="text" name="cpf" required placeholder="000.000.000-00" maxLength={14} className="input-field w-full py-1" value={formData.cpf} onChange={handleChange} />
              </div>
              <div className="input-group m-0 md:col-span-1">
                <label className="input-label text-xs">Data Nasc. *</label>
                <input type="date" name="birthDate" required className="input-field w-full py-1" value={formData.birthDate} onChange={handleChange} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-1">
              <div className="input-group m-0">
                <label className="input-label text-xs">E-mail *</label>
                <input type="email" name="email" required className="input-field w-full py-1" value={formData.email} onChange={handleChange} />
              </div>
              <div className="input-group m-0">
                <label className="input-label text-xs">Telefone / WhatsApp *</label>
                <input type="tel" name="phone" required className="input-field w-full py-1" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            {/* ENDEREÇO */}
            <h3 className="font-bold text-base border-b pb-1 mt-2">Endereço</h3>
            
            <div className="grid md:grid-cols-4 gap-4 mt-1">
              <div className="input-group m-0 md:col-span-1">
                <label className="input-label text-xs">CEP *</label>
                <input type="text" name="cep" required placeholder="00000-000" maxLength={9} className="input-field w-full py-1" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} />
              </div>
              <div className="input-group m-0 md:col-span-3">
                <label className="input-label text-xs">Rua / Logradouro</label>
                <input type="text" name="address" required className="input-field w-full py-1" value={formData.address} onChange={handleChange} />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-1">
              <div className="input-group m-0 md:col-span-2">
                <label className="input-label text-xs">Bairro</label>
                <input type="text" name="neighborhood" required className="input-field w-full py-1" value={formData.neighborhood} onChange={handleChange} />
              </div>
              <div className="input-group m-0 md:col-span-1">
                <label className="input-label text-xs">Cidade</label>
                <input type="text" name="city" required className="input-field w-full py-1" value={formData.city} onChange={handleChange} />
              </div>
              <div className="input-group m-0 md:col-span-1">
                <label className="input-label text-xs">UF</label>
                <input type="text" name="state" required maxLength={2} className="input-field w-full py-1" value={formData.state} onChange={handleChange} />
              </div>
            </div>

            {/* CURRÍCULO E SENHA */}
            <h3 className="font-bold text-base border-b pb-1 mt-2">Currículo e Acesso</h3>

            <div className="grid md:grid-cols-4 gap-4 mt-1">
              <div className="input-group m-0 md:col-span-2">
                <label className="input-label text-xs">Anexar Currículo (PDF)</label>
                <div className="flex gap-2 items-center">
                  <input type="file" name="resume" accept=".pdf" className="input-field w-full py-1 bg-white text-xs" onChange={handleFileChange} ref={fileInputRef} />
                  {resumeFile && (
                    <button type="button" onClick={removeFile} className="p-1 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center" title="Remover currículo">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="input-group m-0 md:col-span-1">
                <label className="input-label text-xs">Senha *</label>
                <input type="password" name="password" required minLength={6} className="input-field w-full py-1" value={formData.password} onChange={handleChange} />
              </div>
              <div className="input-group m-0 md:col-span-1">
                <label className="input-label text-xs">Confirmar Senha *</label>
                <input type="password" name="confirmPassword" required minLength={6} className="input-field w-full py-1" value={formData.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 mb-1">
              <input type="checkbox" id="lgpd" required />
              <label htmlFor="lgpd" className="text-xs">Li e concordo com a Política de Privacidade.</label>
            </div>

            <Button type="submit" disabled={loading} fullWidth style={{ padding: '0.6rem' }}>
              {loading ? "Criando conta..." : "Finalizar Cadastro"}
            </Button>
          </form>

          <div className="mt-4 pt-2 text-center text-xs" style={{ borderTop: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
            Já tem conta? <Link href="/candidato/login" className="text-brand font-medium">Faça login</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
