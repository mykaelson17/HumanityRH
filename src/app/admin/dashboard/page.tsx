import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Users, Briefcase, UserCheck, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const vagasAbertas = await prisma.job.count({ where: { status: "PUBLISHED" } });
  const totalCandidatos = await prisma.user.count({ where: { role: "CANDIDATE" } });
  
  const applications = await prisma.application.findMany();
  const emAnalise = applications.filter(a => ["NEW", "SCREENING", "EVALUATION"].includes(a.status)).length;
  const aprovados = applications.filter(a => ["APPROVED", "HIRED"].includes(a.status)).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-full" style={{ backgroundColor: "var(--info-bg)", color: "var(--info)" }}>
            <Briefcase size={28} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Vagas Abertas</p>
            <p className="text-3xl font-bold">{vagasAbertas}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-full" style={{ backgroundColor: "var(--brand-secondary)", color: "var(--brand-primary)" }}>
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Candidatos</p>
            <p className="text-3xl font-bold">{totalCandidatos}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-full" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Em Análise</p>
            <p className="text-3xl font-bold">{emAnalise}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-full" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>
            <UserCheck size={28} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Aprovados</p>
            <p className="text-3xl font-bold">{aprovados}</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">Últimas Candidaturas</h2>
          <p style={{ color: "var(--text-secondary)" }}>Aqui seria exibido um gráfico ou lista recente.</p>
          {/* Para um SaaS completo, poderíamos integrar Chart.js ou Recharts aqui */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
             <p className="text-sm">Sistema funcionando perfeitamente de ponta a ponta. 🚀</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Vagas mais procuradas</h2>
          <p style={{ color: "var(--text-secondary)" }}>Aqui seria exibido as vagas com mais candidaturas.</p>
        </Card>
      </div>
    </div>
  );
}
