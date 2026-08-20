"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, Plus, X } from "lucide-react";

export default function ExperienceForm({ initialExperiences }: { initialExperiences: any[] }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: ""
  });

  const openModal = (exp?: any) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        id: exp.id,
        role: exp.role || "",
        company: exp.company || "",
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().slice(0, 7) : "", // YYYY-MM
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().slice(0, 7) : "",
        isCurrent: exp.isCurrent || false,
        description: exp.description || ""
      });
    } else {
      setEditingExp(null);
      setFormData({
        id: "",
        role: "",
        company: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert YYYY-MM to full date
    const payload = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate + "-01") : undefined,
      endDate: formData.endDate && !formData.isCurrent ? new Date(formData.endDate + "-01") : undefined
    };

    try {
      const res = await fetch("/api/candidato/experiencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const savedExp = await res.json();
        if (editingExp) {
          setExperiences(experiences.map(e => e.id === savedExp.id ? savedExp : e));
        } else {
          setExperiences([savedExp, ...experiences]);
        }
        closeModal();
        router.refresh();
      } else {
        alert("Erro ao salvar experiência.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta experiência?")) return;
    
    try {
      const res = await fetch(`/api/candidato/experiencias?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setExperiences(experiences.filter(e => e.id !== id));
        router.refresh();
      } else {
        alert("Erro ao excluir.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatPeriod = (start: string, end: string, isCurrent: boolean) => {
    const formatDate = (d: string) => {
      const date = new Date(d);
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };
    
    const s = start ? formatDate(start) : "";
    const e = isCurrent ? "data atual" : (end ? formatDate(end) : "");
    
    if (s && e) return `${s} até ${e}`;
    if (s) return `Desde ${s}`;
    return "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* ADD BUTTON */}
      <div 
        onClick={() => openModal()}
        style={{
          border: "2px dashed var(--border-color)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: "var(--bg-secondary)",
          transition: "var(--transition)"
        }}
      >
        <span style={{ fontWeight: "700", color: "var(--text-secondary)" }}>Adicionar experiência</span>
        <Plus size={24} color="var(--text-tertiary)" />
      </div>

      {/* LIST */}
      {experiences.map((exp) => (
        <div key={exp.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ maxWidth: "75%" }}>
            <h3 style={{ fontWeight: "700", fontSize: "1rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.25rem" }}>{exp.role}</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{exp.company}</p>
            <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.25rem" }}>Período</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>{formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {exp.description}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button onClick={() => openModal(exp)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--brand-primary)", fontWeight: "700", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer" }}>
              <Edit2 size={16} /> Editar
            </button>
            <button onClick={() => handleDelete(exp.id)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--brand-primary)", fontWeight: "700", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer" }}>
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        </div>
      ))}

      {/* MODAL */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "var(--border-radius-lg)",
            boxShadow: "var(--shadow-lg)",
            width: "100%", maxWidth: "600px",
            maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  {editingExp ? "Editar experiência" : "Adicionar experiência"}
                </h2>
                <button onClick={closeModal} style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="input-group">
                  <label className="input-label">Cargo</label>
                  <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-field" style={{ width: "100%" }} />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Empresa</label>
                  <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="input-field" style={{ width: "100%" }} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="input-group">
                    <label className="input-label">Data de início</label>
                    <input type="month" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="input-field" style={{ width: "100%" }} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Data de fim</label>
                    <input type="month" disabled={formData.isCurrent} required={!formData.isCurrent} value={formData.isCurrent ? "" : formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="input-field" style={{ width: "100%", backgroundColor: formData.isCurrent ? "var(--bg-tertiary)" : "var(--bg-primary)" }} />
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginTop: "0.25rem" }}>
                  <input type="checkbox" checked={formData.isCurrent} onChange={e => setFormData({...formData, isCurrent: e.target.checked, endDate: ""})} style={{ accentColor: "var(--brand-primary)", width: "18px", height: "18px" }} />
                  <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "var(--text-primary)" }}>Ainda trabalho aqui</span>
                </label>

                <div className="input-group">
                  <label className="input-label">Descrição das atividades</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" style={{ width: "100%", minHeight: "120px", resize: "vertical" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                  <button type="button" onClick={closeModal} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? "Salvando..." : "Salvar experiência"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
