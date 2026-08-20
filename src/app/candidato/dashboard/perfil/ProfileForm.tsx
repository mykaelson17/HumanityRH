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
        body: JSON.stringify(formData)
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

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      {/* 1. INFORMAÇÕES PESSOAIS */}
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <div 
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => toggleSection("pessoais")}
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            Informações pessoais {formData.cpf && <CheckCircle size={18} className="text-green-500" />}
          </h2>
          {openSection === "pessoais" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {openSection === "pessoais" && (
          <div className="p-6 border-t">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome completo (Nome social)*</label>
                <input name="socialName" required value={formData.socialName} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email*</label>
                <input name="email" type="email" required disabled value={formData.email} className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email secundário <span className="font-normal text-gray-400">Opcional</span></label>
                <input name="secondaryEmail" type="email" value={formData.secondaryEmail} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">CPF*</label>
                <input name="cpf" required value={formData.cpf} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Telefone*</label>
                <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Data de nascimento*</label>
                <input name="birthDate" type="date" required value={formData.birthDate} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Link do Linkedin <span className="font-normal text-gray-400">Opcional</span></label>
                <input name="linkedin" type="url" value={formData.linkedin} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand" placeholder="https://www.linkedin.com/in/..." />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Você possui alguma deficiência?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="deficiency" value="Sim" checked={formData.deficiency === "Sim"} onChange={handleChange} className="w-4 h-4 text-brand" /> Sim
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="deficiency" value="Não" checked={formData.deficiency === "Não"} onChange={handleChange} className="w-4 h-4 text-brand" /> Não
                </label>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-sm text-blue-800">
              <Info className="shrink-0 text-blue-500" size={20} />
              <div>
                <strong>Porque pedimos essas informações</strong><br/>
                Inúmeras organizações comprometidas em aumentar a inclusão publicam vagas exclusivas ou elegíveis para PCD. Fornecer essa informação ajuda a empresa.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. DIVERSIDADE */}
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <div 
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => toggleSection("diversidade")}
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            Diversidade {formData.race && <CheckCircle size={18} className="text-green-500" />}
          </h2>
          {openSection === "diversidade" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {openSection === "diversidade" && (
          <div className="p-6 border-t">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Qual o seu sexo? <span className="font-normal text-gray-400">Opcional</span></label>
                <select name="sex" value={formData.sex} onChange={handleChange} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-brand">
                  <option value="">Selecione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Intersexo">Intersexo</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Qual a sua raça/cor? <span className="font-normal text-gray-400">Opcional</span></label>
                <select name="race" value={formData.race} onChange={handleChange} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-brand">
                  <option value="">Selecione...</option>
                  <option value="Branca">Branca</option>
                  <option value="Preta">Preta</option>
                  <option value="Parda">Parda</option>
                  <option value="Amarela">Amarela</option>
                  <option value="Indígena">Indígena</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Qual a sua orientação sexual? <span className="font-normal text-gray-400">Opcional</span></label>
                <select name="sexualOrientation" value={formData.sexualOrientation} onChange={handleChange} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-brand">
                  <option value="">Selecione...</option>
                  <option value="Heterossexual">Heterossexual</option>
                  <option value="Homossexual">Homossexual</option>
                  <option value="Bissexual">Bissexual</option>
                  <option value="Outra">Outra</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Qual o seu gênero? <span className="font-normal text-gray-400">Opcional</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-brand">
                  <option value="">Selecione...</option>
                  <option value="Cisgênero">Cisgênero</option>
                  <option value="Transgênero">Transgênero</option>
                  <option value="Não-binário">Não-binário</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-sm text-blue-800">
              <Info className="shrink-0 text-blue-500" size={20} />
              <div>
                <strong>Porque pedimos essas informações</strong><br/>
                Esses dados são importantes para empresas que acreditam e promovem a diversidade. Estas informações <strong>não são eliminatórias</strong> e os campos <strong>não são obrigatórios</strong>.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. RESUMO PROFISSIONAL */}
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <div 
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => toggleSection("resumo")}
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            Resumo Profissional {formData.summary && <CheckCircle size={18} className="text-green-500" />}
          </h2>
          {openSection === "resumo" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {openSection === "resumo" && (
          <div className="p-6 border-t">
            <p className="text-sm text-gray-600 mb-2">Escreva um breve resumo sobre suas habilidades, objetivos e trajetória profissional.</p>
            <textarea 
              name="summary" 
              value={formData.summary} 
              onChange={handleChange} 
              className="w-full p-3 border rounded focus:ring-2 focus:ring-brand" 
              rows={6}
              placeholder="Ex: Profissional com 5 anos de experiência na área de tecnologia..."
            />
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={loading} style={{ padding: "0.8rem 2rem" }}>
          {loading ? "Salvando..." : "Salvar Perfil"}
        </Button>
      </div>
    </form>
  );
}
