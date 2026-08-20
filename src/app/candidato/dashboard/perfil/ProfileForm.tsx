"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ProfileForm({ user, profile }: { user: any, profile: any }) {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>("pessoais");
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    socialName: profile?.socialName || user?.name || "",
    email: user?.email || "",
    secondaryEmail: profile?.secondaryEmail || "",
    cpf: profile?.cpf || "",
    phone: user?.phone || "",
    birthDate: profile?.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : "",
    age: profile?.age || "",
    zipCode: profile?.zipCode || "",
    address: profile?.address || "",
    city: profile?.city || "",
    state: profile?.state || "",
    linkedin: profile?.linkedin || "",
    deficiency: profile?.deficiency || "Não",
    sex: profile?.sex || "",
    race: profile?.race || "",
    sexualOrientation: profile?.sexualOrientation || "",
    gender: profile?.gender || "",
    summary: profile?.summary || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/candidato/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(String(formData.age)) : undefined
        })
      });
      if (res.ok) {
        alert("Perfil atualizado com sucesso!");
        router.refresh();
      } else {
        alert("Erro ao atualizar o perfil.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const accordionStyle = {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--border-radius-lg)",
    overflow: "hidden",
    boxShadow: "var(--shadow-sm)",
    marginBottom: "1rem"
  };

  const headerStyle = {
    padding: "1rem 1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "var(--bg-tertiary)",
    borderBottom: "1px solid var(--border-color)",
  };

  const bodyStyle = {
    padding: "1.5rem",
  };

  const infoBoxStyle = {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "var(--info-bg)",
    border: "1px solid #bfdbfe", // light blue border
    borderRadius: "var(--border-radius-md)",
    display: "flex",
    gap: "1rem",
    color: "#1e3a8a", // dark blue text
    fontSize: "0.875rem"
  };

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* 1. INFORMAÇÕES PESSOAIS */}
      <div style={accordionStyle}>
        <div style={headerStyle} onClick={() => toggleSection("pessoais")}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Informações pessoais {formData.cpf && <CheckCircle size={18} color="var(--success)" />}
          </h2>
          {openSection === "pessoais" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {openSection === "pessoais" && (
          <div style={bodyStyle}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                <label className="input-label">Nome completo (Nome social)*</label>
                <input name="socialName" required value={formData.socialName} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>

              <div className="input-group">
                <label className="input-label">Email*</label>
                <input name="email" type="email" required disabled value={formData.email} className="input-field" style={{ width: "100%", backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)", cursor: "not-allowed" }} />
              </div>
              <div className="input-group">
                <label className="input-label">Email secundário <span style={{ fontWeight: "normal", color: "var(--text-tertiary)" }}>Opcional</span></label>
                <input name="secondaryEmail" type="email" value={formData.secondaryEmail} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>

              <div className="input-group">
                <label className="input-label">CPF*</label>
                <input name="cpf" required value={formData.cpf} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>
              <div className="input-group">
                <label className="input-label">Telefone*</label>
                <input name="phone" required value={formData.phone} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>

              <div className="input-group">
                <label className="input-label">Data de nascimento*</label>
                <input name="birthDate" type="date" required value={formData.birthDate} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>
              <div className="input-group">
                <label className="input-label">Idade</label>
                <input name="age" type="number" value={formData.age} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>

              <div className="input-group">
                <label className="input-label">CEP</label>
                <input name="zipCode" value={formData.zipCode} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>
              <div className="input-group">
                <label className="input-label">Endereço (Rua, Número, Bairro)</label>
                <input name="address" value={formData.address} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>

              <div className="input-group">
                <label className="input-label">Cidade</label>
                <input name="city" value={formData.city} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>
              <div className="input-group">
                <label className="input-label">Estado (UF)</label>
                <input name="state" value={formData.state} onChange={handleChange} className="input-field" style={{ width: "100%" }} />
              </div>

              <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                <label className="input-label">Link do Linkedin <span style={{ fontWeight: "normal", color: "var(--text-tertiary)" }}>Opcional</span></label>
                <input name="linkedin" type="url" value={formData.linkedin} onChange={handleChange} className="input-field" style={{ width: "100%" }} placeholder="https://www.linkedin.com/in/..." />
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label className="input-label" style={{ marginBottom: "0.5rem", display: "block" }}>Você possui alguma deficiência?</label>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="radio" name="deficiency" value="Sim" checked={formData.deficiency === "Sim"} onChange={handleChange} style={{ accentColor: "var(--brand-primary)", width: "16px", height: "16px" }} /> Sim
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="radio" name="deficiency" value="Não" checked={formData.deficiency === "Não"} onChange={handleChange} style={{ accentColor: "var(--brand-primary)", width: "16px", height: "16px" }} /> Não
                </label>
              </div>
            </div>

            <div style={infoBoxStyle}>
              <Info size={20} color="var(--info)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Porque pedimos essas informações</strong><br/>
                Inúmeras organizações comprometidas em aumentar a inclusão publicam vagas exclusivas ou elegíveis para PCD. Fornecer essa informação ajuda a empresa.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. DIVERSIDADE */}
      <div style={accordionStyle}>
        <div style={headerStyle} onClick={() => toggleSection("diversidade")}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Diversidade {formData.race && <CheckCircle size={18} color="var(--success)" />}
          </h2>
          {openSection === "diversidade" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {openSection === "diversidade" && (
          <div style={bodyStyle}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Qual o seu sexo? <span style={{ fontWeight: "normal", color: "var(--text-tertiary)" }}>Opcional</span></label>
                <select name="sex" value={formData.sex} onChange={handleChange} className="input-field" style={{ width: "100%" }}>
                  <option value="">Selecione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Intersexo">Intersexo</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Qual a sua raça/cor? <span style={{ fontWeight: "normal", color: "var(--text-tertiary)" }}>Opcional</span></label>
                <select name="race" value={formData.race} onChange={handleChange} className="input-field" style={{ width: "100%" }}>
                  <option value="">Selecione...</option>
                  <option value="Branca">Branca</option>
                  <option value="Preta">Preta</option>
                  <option value="Parda">Parda</option>
                  <option value="Amarela">Amarela</option>
                  <option value="Indígena">Indígena</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Qual a sua orientação sexual? <span style={{ fontWeight: "normal", color: "var(--text-tertiary)" }}>Opcional</span></label>
                <select name="sexualOrientation" value={formData.sexualOrientation} onChange={handleChange} className="input-field" style={{ width: "100%" }}>
                  <option value="">Selecione...</option>
                  <option value="Heterossexual">Heterossexual</option>
                  <option value="Homossexual">Homossexual</option>
                  <option value="Bissexual">Bissexual</option>
                  <option value="Outra">Outra</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Qual o seu gênero? <span style={{ fontWeight: "normal", color: "var(--text-tertiary)" }}>Opcional</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field" style={{ width: "100%" }}>
                  <option value="">Selecione...</option>
                  <option value="Cisgênero">Cisgênero</option>
                  <option value="Transgênero">Transgênero</option>
                  <option value="Não-binário">Não-binário</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
            </div>

            <div style={infoBoxStyle}>
              <Info size={20} color="var(--info)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Porque pedimos essas informações</strong><br/>
                Esses dados são importantes para empresas que acreditam e promovem a diversidade. Estas informações <strong>não são eliminatórias</strong> e os campos <strong>não são obrigatórios</strong>.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. RESUMO PROFISSIONAL */}
      <div style={accordionStyle}>
        <div style={headerStyle} onClick={() => toggleSection("resumo")}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Resumo Profissional {formData.summary && <CheckCircle size={18} color="var(--success)" />}
          </h2>
          {openSection === "resumo" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {openSection === "resumo" && (
          <div style={bodyStyle}>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>Escreva um breve resumo sobre suas habilidades, objetivos e trajetória profissional.</p>
            <div className="input-group">
              <textarea 
                name="summary" 
                value={formData.summary} 
                onChange={handleChange} 
                className="input-field" 
                style={{ width: "100%", minHeight: "150px", resize: "vertical" }}
                placeholder="Ex: Profissional com 5 anos de experiência na área de tecnologia..."
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Perfil"}
        </button>
      </div>
    </form>
  );
}
