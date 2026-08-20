"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type AppData = {
  id: string;
  status: string;
  candidateName: string | null;
  candidateCity: string | null;
  candidateAge: number | null;
  skillsCount: number;
  candidateId: string;
};

const COLUMNS = [
  { id: "NEW", title: "Novos", color: "var(--info-bg)" },
  { id: "SCREENING", title: "Triagem", color: "var(--warning-bg)" },
  { id: "INTERVIEW", title: "Entrevista", color: "var(--bg-tertiary)" },
  { id: "EVALUATION", title: "Avaliação", color: "var(--warning-bg)" },
  { id: "APPROVED", title: "Aprovado", color: "var(--success-bg)" },
  { id: "HIRED", title: "Contratado", color: "var(--success-bg)" },
];

export default function KanbanBoard({ initialApplications }: { initialApplications: AppData[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedAppId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (statusId: string) => {
    if (!draggedAppId) return;

    // Optimistic UI update
    setApplications(prev => 
      prev.map(app => app.id === draggedAppId ? { ...app, status: statusId } : app)
    );

    try {
      const res = await fetch(`/api/admin/applications/${draggedAppId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusId }),
      });

      if (!res.ok) {
        throw new Error("Falha ao atualizar");
      }
    } catch (error) {
      console.error(error);
      // Revert on error
      setApplications(initialApplications);
    } finally {
      setDraggedAppId(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: "1rem", height: "100%", paddingBottom: "1rem" }}>
      {COLUMNS.map(col => {
        const colApps = applications.filter(a => a.status === col.id);

        return (
          <div 
            key={col.id} 
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.id)}
            style={{ 
              minWidth: "280px", 
              backgroundColor: "var(--bg-secondary)", 
              borderRadius: "var(--border-radius-md)", 
              padding: "1rem",
              border: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold">{col.title}</h3>
              <span className="badge badge-neutral">{colApps.length}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
              {colApps.map(app => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={() => handleDragStart(app.id)}
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--border-radius-sm)",
                    padding: "1rem",
                    cursor: "grab",
                    boxShadow: "var(--shadow-sm)"
                  }}
                  className="hover:shadow-md transition-all"
                >
                  <p className="font-bold mb-1">{app.candidateName}</p>
                  <div className="text-xs flex flex-col gap-1 mb-3" style={{ color: "var(--text-secondary)" }}>
                    {app.candidateAge && <span>Idade: {app.candidateAge} anos</span>}
                    {app.candidateCity && <span>Local: {app.candidateCity}</span>}
                    <span>⭐ {app.skillsCount} habilidades</span>
                  </div>
                  <Button variant="outline" className="w-full text-xs p-1 h-auto py-1">Ver Perfil</Button>
                </div>
              ))}
              
              {colApps.length === 0 && (
                <div className="text-center py-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Arraste candidatos para cá
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
