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
    <div className="flex flex-col gap-4">
      {/* ADD BUTTON */}
      <div 
        onClick={() => openModal()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-700">Adicionar experiência</span>
        <Plus size={24} className="text-gray-500" />
      </div>

      {/* LIST */}
      {experiences.map((exp) => (
        <div key={exp.id} className="border rounded-lg bg-white p-6 shadow-sm flex justify-between items-start">
          <div className="max-w-[75%]">
            <h3 className="font-bold text-sm tracking-wide uppercase text-gray-900 mb-1">{exp.role}</h3>
            <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
            <p className="text-xs font-bold text-gray-800 mb-2">Período</p>
            <p className="text-xs text-gray-600 mb-4">{formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}</p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {exp.description}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => openModal(exp)} className="flex items-center gap-2 text-brand font-bold text-sm hover:underline">
              <Edit2 size={16} /> Editar
            </button>
            <button onClick={() => handleDelete(exp.id)} className="flex items-center gap-2 text-brand font-bold text-sm hover:underline">
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        </div>
      ))}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{editingExp ? "Editar experiência" : "Adicionar experiência"}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cargo</label>
                  <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand" />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Empresa</label>
                  <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Data de início</label>
                    <input type="month" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Data de fim</label>
                    <input type="month" disabled={formData.isCurrent} required={!formData.isCurrent} value={formData.isCurrent ? "" : formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand ${formData.isCurrent ? "bg-gray-100 cursor-not-allowed" : ""}`} />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input type="checkbox" checked={formData.isCurrent} onChange={e => setFormData({...formData, isCurrent: e.target.checked, endDate: ""})} className="w-5 h-5 text-brand rounded focus:ring-brand" />
                  <span className="text-sm font-medium text-gray-700">Ainda trabalho aqui</span>
                </label>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Descrição das atividades</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand" rows={6} />
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                  <button type="button" onClick={closeModal} className="px-6 py-2 border rounded-lg text-brand font-bold hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-brand text-white rounded-lg font-bold hover:opacity-90 transition-opacity">
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
