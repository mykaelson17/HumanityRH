"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Search, MapPin, X, Heart, Building, Filter, LayoutGrid, List, SlidersHorizontal } from "lucide-react";

type JobType = {
  id: string;
  title: string;
  department: string;
  city: string;
  state: string;
  modality: string;
  minSalary: number | null;
  contractType: string;
};

export default function VagasClient({ jobs, initialQuery }: { jobs: JobType[], initialQuery?: string }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container relative">
      
      {/* Search and Filters Header */}
      <div className="mb-8">
        <div style={{ 
          backgroundColor: "white",
          padding: "1.25rem 1.5rem", 
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
        }}>
          <form style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "flex-end", width: "100%" }}>
            <div style={{ flex: "4 1 250px" }}>
              <label className="text-xs font-bold mb-2" style={{ color: "#111827", display: "block" }}>Qual vaga de emprego procura?</label>
              <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "8px", padding: "0.5rem 0.75rem", width: "100%" }}>
                <Search size={18} style={{ color: "#6b7280" }} />
                <input 
                  type="text" 
                  name="q"
                  defaultValue={initialQuery}
                  placeholder="Digite o nome da vaga ou cargo"
                  style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "0.95rem", marginLeft: "0.5rem", padding: "0.25rem 0", color: "#111827" }}
                />
              </div>
            </div>

            <div style={{ flex: "4 1 250px" }}>
              <label className="text-xs font-bold mb-2" style={{ color: "#111827", display: "block" }}>Onde você procura trabalho?</label>
              <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "8px", padding: "0.5rem 0.75rem", width: "100%" }}>
                <MapPin size={18} style={{ color: "#6b7280" }} />
                <input 
                  type="text" 
                  name="city" 
                  placeholder="Digite o nome da cidade"
                  style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "0.95rem", marginLeft: "0.5rem", padding: "0.25rem 0", color: "#111827" }}
                />
              </div>
            </div>

            <div style={{ flex: "2 1 150px", display: "flex", gap: "0.5rem" }}>
              <Button type="submit" variant="primary" style={{ flex: 1, padding: "0.85rem 1rem", fontSize: "1rem", whiteSpace: "nowrap", borderRadius: "8px" }}>
                Buscar vagas
              </Button>
              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                style={{ 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 1rem",
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  cursor: "pointer"
                }}
                title="Filtros avançados"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Filtros Avançados */}
      {showFilters && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "100%", maxWidth: "450px", backgroundColor: "white", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", boxShadow: "-4px 0 15px rgba(0,0,0,0.1)" }}>
            
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, backgroundColor: "white", zIndex: 10 }}>
              <h2 className="text-xl font-bold" style={{ color: "#111827" }}>Filtros Avançados</h2>
              <button onClick={() => setShowFilters(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              {/* Senioridade */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold" style={{ color: "#111827" }}>Senioridade</h3>
                  <button className="text-sm font-medium" style={{ color: "var(--brand-primary)", background: "none", border: "none", cursor: "pointer" }}>Selecionar todos</button>
                </div>
                <div className="flex flex-col gap-2">
                  {["Estágio", "Júnior", "Pleno", "Sênior", "Especialista", "Principal"].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" style={{ width: "18px", height: "18px", accentColor: "var(--brand-primary)", cursor: "pointer" }} />
                      <span style={{ color: "#4b5563", fontSize: "0.95rem" }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modalidade de trabalho */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold" style={{ color: "#111827" }}>Modalidade de trabalho</h3>
                  <button className="text-sm font-medium" style={{ color: "var(--brand-primary)", background: "none", border: "none", cursor: "pointer" }}>Selecionar todos</button>
                </div>
                <div className="flex flex-col gap-2">
                  {["Presencial", "Remoto", "Híbrido"].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" style={{ width: "18px", height: "18px", accentColor: "var(--brand-primary)", cursor: "pointer" }} />
                      <span style={{ color: "#4b5563", fontSize: "0.95rem" }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Faixa salarial */}
              <div>
                <h3 className="font-bold mb-3" style={{ color: "#111827" }}>Faixa salarial</h3>
                <div className="flex flex-col gap-2">
                  {["Todas as faixas (Padrão)", "Até R$ 1.000", "R$ 1.000 a R$ 5.000", "Acima de R$ 5.000"].map((item, idx) => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="salary" defaultChecked={idx === 0} style={{ width: "18px", height: "18px", accentColor: "var(--brand-primary)", cursor: "pointer" }} />
                      <span style={{ color: "#4b5563", fontSize: "0.95rem" }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modalidade de contratação */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold" style={{ color: "#111827" }}>Modalidade de contratação</h3>
                  <button className="text-sm font-medium" style={{ color: "var(--brand-primary)", background: "none", border: "none", cursor: "pointer" }}>Selecionar todos</button>
                </div>
                <div className="flex flex-col gap-2">
                  {["Estágio", "Aprendiz", "CLT (efetivo)", "Prestador de serviço (PJ)", "Temporário", "Autônomo", "Freelancer", "Cooperado"].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" style={{ width: "18px", height: "18px", accentColor: "var(--brand-primary)", cursor: "pointer" }} />
                      <span style={{ color: "#4b5563", fontSize: "0.95rem" }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Área de atuação */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold" style={{ color: "#111827" }}>Área de atuação</h3>
                  <button className="text-sm font-medium" style={{ color: "var(--brand-primary)", background: "none", border: "none", cursor: "pointer" }}>Selecionar todos</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Administrativo", "Agronegócio", "Comercial", "Compras", "Comunicação", "Design", "Educação", "Engenharia", "Financeiro", "Jurídico", "Logística", "Marketing", "Primeiro emprego", "Produção", "Recursos Humanos", "Saúde", "Tecnologia", "Turismo"].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" style={{ width: "18px", height: "18px", accentColor: "var(--brand-primary)", cursor: "pointer" }} />
                      <span style={{ color: "#4b5563", fontSize: "0.95rem" }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ padding: "1.5rem", borderTop: "1px solid #e5e7eb", position: "sticky", bottom: 0, backgroundColor: "white", display: "flex", gap: "1rem" }}>
              <Button variant="outline" style={{ flex: 1 }}>Limpar Tudo</Button>
              <Button variant="primary" style={{ flex: 1 }} onClick={() => setShowFilters(false)}>Aplicar Filtros</Button>
            </div>

          </div>
        </div>
      )}

      {/* Top Bar: Title & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vagas</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{jobs.length} vaga(s) encontrada(s)</p>
        </div>

        <div className="flex items-center gap-4">
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Ordenadas por: <span className="font-medium text-black">Data de postagem</span>
          </span>
          
          <div className="flex bg-white rounded-md border overflow-hidden" style={{ borderColor: "var(--border-color)" }}>
             <button 
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
                style={{ borderRight: "1px solid var(--border-color)", backgroundColor: viewMode === "list" ? "var(--bg-tertiary)" : "transparent" }}
             >
                <List size={18} />
             </button>
             <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                style={{ backgroundColor: viewMode === "grid" ? "var(--bg-tertiary)" : "transparent" }}
             >
                <LayoutGrid size={18} />
             </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-8 relative">
        {/* O modal de filtros foi removido, pois os filtros agora estão in-line */}

        {/* Jobs List / Grid */}
        <div className="w-full">
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
            {jobs.map((job) => (
              <Card key={job.id} style={{ display: "flex", flexDirection: "column", padding: "1.5rem" }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    {/* Placeholder Icon like the image */}
                    <div style={{ width: "40px", height: "40px", backgroundColor: "var(--bg-tertiary)", borderRadius: "var(--border-radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                      <Building size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                        {job.title}
                      </h3>
                      <p className="text-xs uppercase mt-1" style={{ color: "var(--text-secondary)" }}>{job.department}</p>
                    </div>
                  </div>
                  <button style={{ color: "var(--brand-primary)", background: "transparent", border: "none", cursor: "pointer" }}>
                    <Heart size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    <MapPin size={16} /> {job.city} - {job.state}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    <span className="font-bold">R$</span> {job.minSalary ? job.minSalary : "A combinar"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span style={{ 
                    backgroundColor: "#e0f2fe", 
                    color: "#0284c7", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "4px", 
                    fontSize: "0.75rem", 
                    fontWeight: "600" 
                  }}>
                    {job.modality}
                  </span>
                  {/* Fake badges based on image style */}
                  {job.title.includes("Junior") && (
                    <span style={{ backgroundColor: "#e0f2fe", color: "#0284c7", padding: "0.25rem 0.75rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600" }}>Junior</span>
                  )}
                </div>

                <div className="mt-auto">
                  <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>Postada recentemente</p>
                  <Link href={`/vagas/${job.id}`}>
                    <Button variant="primary" fullWidth style={{ borderRadius: "var(--border-radius-sm)" }}>
                      Ver mais detalhes
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
            
            {jobs.length === 0 && (
              <Card className="text-center py-12 col-span-2">
                <p className="text-lg" style={{ color: "var(--text-secondary)" }}>Nenhuma vaga encontrada com os critérios atuais.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
