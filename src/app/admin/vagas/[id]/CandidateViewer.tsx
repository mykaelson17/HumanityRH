"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UserX, FileText } from "lucide-react";

type AppData = {
  id: string;
  status: string;
  candidateName: string;
  candidateEmail: string;
  candidateAge: number | null;
  candidatePhone: string | null;
  resumeUrl: string | null;
  createdAt: string;
};

export default function CandidateViewer({ initialApplications }: { initialApplications: AppData[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(initialApplications.length > 0 ? initialApplications[0].id : null);
  const [loadingApp, setLoadingApp] = useState<string | null>(null);

  const selectedApp = applications.find(a => a.id === selectedAppId);

  const handleReject = async (appId: string) => {
    setLoadingApp(appId);
    try {
      const res = await fetch(`/api/admin/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (!res.ok) throw new Error("Falha ao reprovar");

      setApplications(prev => 
        prev.map(app => app.id === appId ? { ...app, status: "REJECTED" } : app)
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao reprovar candidato");
    } finally {
      setLoadingApp(null);
    }
  };

  return (
    <div className="flex h-full gap-4 border rounded-lg overflow-hidden bg-white" style={{ borderColor: "var(--border-color)", height: "100%" }}>
      
      {/* Left Pane: Candidate List */}
      <div className="w-1/3 h-full overflow-y-auto border-r" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-primary)" }}>
        {applications.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>Nenhum candidato ainda.</div>
        ) : (
          <ul className="flex flex-col">
            {applications.map(app => {
              const isSelected = selectedAppId === app.id;
              const isRejected = app.status === "REJECTED";
              
              return (
                <li 
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors`}
                  style={{ 
                    borderColor: "var(--border-color)",
                    backgroundColor: isSelected ? "var(--bg-tertiary)" : "transparent",
                    opacity: isRejected ? 0.5 : 1,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base" style={{ textDecoration: isRejected ? "line-through" : "none" }}>
                      {app.candidateName}
                    </h3>
                    {isRejected && <span className="text-xs text-danger font-bold">Reprovado</span>}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    {new Date(app.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Right Pane: Details & Resume Preview */}
      <div className="w-2/3 h-full flex flex-col bg-gray-50">
        {selectedApp ? (
          <>
            {/* Header / Actions */}
            <div className="p-4 bg-white border-b flex justify-between items-center" style={{ borderColor: "var(--border-color)" }}>
              <div>
                <h2 className="text-xl font-bold">{selectedApp.candidateName}</h2>
                <div className="flex gap-4 mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span>{selectedApp.candidateEmail}</span>
                  {selectedApp.candidatePhone && <span>• {selectedApp.candidatePhone}</span>}
                  {selectedApp.candidateAge && <span>• {selectedApp.candidateAge} anos</span>}
                </div>
              </div>
              
              {selectedApp.status !== "REJECTED" ? (
                <Button 
                  variant="outline" 
                  onClick={() => handleReject(selectedApp.id)}
                  disabled={loadingApp === selectedApp.id}
                  className="flex items-center gap-2 border-danger text-danger hover:bg-red-50"
                  style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                >
                  <UserX size={16} /> 
                  {loadingApp === selectedApp.id ? "Processando..." : "Reprovar Candidato"}
                </Button>
              ) : (
                <div className="badge badge-danger p-2 px-4">Candidato Reprovado</div>
              )}
            </div>

            {/* Resume Preview Iframe */}
            <div className="flex-1 p-4 overflow-hidden">
              {selectedApp.resumeUrl ? (
                <iframe 
                  src={selectedApp.resumeUrl} 
                  className="w-full h-full rounded border"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "white" }}
                  title={`Currículo de ${selectedApp.candidateName}`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center border-dashed border-2 rounded-lg" style={{ borderColor: "var(--border-color)", color: "var(--text-tertiary)" }}>
                  <FileText size={48} className="mb-4 opacity-50" />
                  <p>Nenhum currículo em PDF foi anexado por este candidato.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-sm" style={{ color: "var(--text-tertiary)" }}>
            Selecione um candidato ao lado para visualizar os detalhes.
          </div>
        )}
      </div>

    </div>
  );
}
