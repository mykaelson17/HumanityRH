"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ExperienceForm({ initialExperiences }: { initialExperiences: any[] }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const handleChange = (index: number, field: string, value: string) => {
    const newExps = [...experiences];
    newExps[index] = { ...newExps[index], [field]: value };
    setExperiences(newExps);
  };

  const handleSave = async (exp: any, index: number) => {
    const tempId = exp.id || `temp-${index}`;
    setLoadingIds({ ...loadingIds, [tempId]: true });
    try {
      const res = await fetch("/api/candidato/experiencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exp)
      });
      if (res.ok) {
        const savedExp = await res.json();
        const newExps = [...experiences];
        newExps[index] = savedExp;
        setExperiences(newExps);
        alert("Salvo com sucesso!");
        router.refresh();
      } else {
        alert("Erro ao salvar.");
      }
    } finally {
      setLoadingIds({ ...loadingIds, [tempId]: false });
    }
  };

  const addExperience = () => {
    setExperiences([...experiences, { id: "", company: "", role: "", description: "" }]);
  };

  return (
    <div className="flex flex-col gap-6">
      {experiences.map((exp, index) => (
        <Card key={exp.id || index} className="p-6">
          <div className="flex flex-col gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="input-group m-0">
                <label className="input-label text-xs">Empresa</label>
                <input 
                  type="text" 
                  value={exp.company || ""} 
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                  className="input-field w-full py-2"
                />
              </div>
              <div className="input-group m-0">
                <label className="input-label text-xs">Cargo</label>
                <input 
                  type="text" 
                  value={exp.role || ""} 
                  onChange={(e) => handleChange(index, "role", e.target.value)}
                  className="input-field w-full py-2"
                />
              </div>
            </div>
            <div className="input-group m-0">
              <label className="input-label text-xs">Descrição (Texto Livre / Currículo extraído)</label>
              <textarea 
                value={exp.description || ""} 
                onChange={(e) => handleChange(index, "description", e.target.value)}
                className="input-field w-full py-2"
                rows={12}
                style={{ resize: "vertical", fontFamily: "monospace" }}
              />
            </div>
            <div className="flex justify-end mt-2">
              <Button 
                onClick={() => handleSave(exp, index)} 
                disabled={loadingIds[exp.id || `temp-${index}`]}
              >
                {loadingIds[exp.id || `temp-${index}`] ? "Salvando..." : "Salvar Experiência"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={addExperience} className="w-full" style={{ padding: "1rem" }}>
        + Adicionar Nova Experiência
      </Button>
    </div>
  );
}
