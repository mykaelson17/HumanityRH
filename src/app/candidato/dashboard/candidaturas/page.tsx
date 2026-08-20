import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, Building, Calendar } from "lucide-react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CandidaturasPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId }
  });

  const params = await searchParams;
  const filterStatus = params.status as string | undefined;
  
  const applications = await prisma.application.findMany({
    where: { 
      candidateProfileId: profile?.id,
      ...(filterStatus ? { status: filterStatus } : {})
    },
    include: { job: true },
    orderBy: { createdAt: "desc" }
  });

  const stages = [
    { id: "NEW", label: "Nova" },
    { id: "SCREENING", label: "Em Análise" },
    { id: "INTERVIEW", label: "Entrevista" },
    { id: "EVALUATION", label: "Avaliação" },
    { id: "APPROVED", label: "Aprovado" }
  ];

  const getStageIndex = (status: string) => {
    if (status === "HIRED") return 4;
    return stages.findIndex(s => s.id === status);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>Minhas Candidaturas</h1>
          <p style={{ color: "var(--text-secondary)" }}>Acompanhe o status e o progresso dos seus processos seletivos.</p>
        </div>
        {filterStatus && (
          <Link href="/candidato/dashboard/candidaturas" className="btn btn-outline" style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
            Ver todas
          </Link>
        )}
      </div>
      
      {applications.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {applications.map(app => {
            const currentStageIdx = getStageIndex(app.status);
            const isRejected = app.status === "REJECTED";

            return (
              <div key={app.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.5rem" }}>{app.job.title}</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Building size={16} color="var(--brand-primary)"/> Humanity</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Briefcase size={16} color="var(--brand-primary)"/> {app.job.modality}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={16} color="var(--brand-primary)"/> Candidatou-se em {new Date(app.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                  <Link href={`/vagas/${app.job.id}`} className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                    Ver Detalhes da Vaga
                  </Link>
                </div>

                {/* Progress Bar */}
                <div style={{ backgroundColor: "var(--bg-primary)", padding: "2rem", borderRadius: "var(--border-radius-lg)", border: "1px solid var(--border-color)" }}>
                  <p style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "2rem", color: isRejected ? "var(--danger)" : "var(--text-primary)", textAlign: "center" }}>
                    Status atual: {isRejected ? "Processo Encerrado" : (app.status === "HIRED" ? "Contratado" : stages[currentStageIdx]?.label || app.status)}
                  </p>
                  
                  {!isRejected && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", maxWidth: "800px", margin: "0 auto", paddingBottom: "1.5rem" }}>
                      {/* Background Line */}
                      <div style={{ position: "absolute", top: "12px", left: "24px", right: "24px", height: "4px", backgroundColor: "var(--border-color)", zIndex: 0 }}></div>
                      
                      {/* Active Line */}
                      <div style={{ position: "absolute", top: "12px", left: "24px", width: `calc(${(currentStageIdx / (stages.length - 1)) * 100}% - 48px)`, height: "4px", backgroundColor: "var(--brand-primary)", zIndex: 1, transition: "width 0.5s ease" }}></div>

                      {/* Circles */}
                      {stages.map((stage, idx) => {
                        const isActive = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;
                        return (
                          <div key={stage.id} style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", width: "48px" }}>
                            <div style={{ 
                              width: "28px", height: "28px", borderRadius: "50%", 
                              backgroundColor: isActive ? "var(--brand-primary)" : "var(--bg-secondary)", 
                              border: `4px solid ${isActive ? "var(--brand-primary)" : "var(--border-color)"}`,
                              boxShadow: isCurrent ? "0 0 0 4px var(--brand-secondary)" : "none",
                              transition: "all 0.3s ease"
                            }}></div>
                            <span style={{ fontSize: "0.75rem", fontWeight: isActive ? "700" : "500", color: isActive ? "var(--text-primary)" : "var(--text-tertiary)", position: "absolute", top: "36px", whiteSpace: "nowrap" }}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: "4rem 2rem" }}>
          <Briefcase size={48} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Nenhuma candidatura encontrada</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem auto" }}>
            {filterStatus ? "Você não tem candidaturas neste status." : "Você ainda não se candidatou a nenhuma vaga."}
          </p>
          <Link href="/vagas" className="btn btn-primary">
            Explorar Vagas
          </Link>
        </div>
      )}
    </div>
  );
}
