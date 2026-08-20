import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function CandidatoDashboard() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    include: { experiences: true }
  });

  const applications = await prisma.application.findMany({
    where: { candidateProfileId: profile?.id },
    include: { job: true },
    orderBy: { createdAt: "desc" }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW": return <span className="badge badge-info">Nova</span>;
      case "SCREENING": return <span className="badge badge-warning">Em Análise</span>;
      case "INTERVIEW": return <span className="badge badge-neutral">Entrevista</span>;
      case "EVALUATION": return <span className="badge badge-warning">Avaliação</span>;
      case "APPROVED": return <span className="badge badge-success">Aprovado</span>;
      case "HIRED": return <span className="badge badge-success">Contratado</span>;
      case "REJECTED": return <span className="badge badge-danger">Reprovado</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Olá, {session?.user?.name}!</h1>
        <p style={{ color: "var(--text-secondary)" }}>Acompanhe o status das suas candidaturas abaixo.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <h3 className="text-4xl font-bold text-brand mb-2">{applications.length}</h3>
          <p style={{ color: "var(--text-secondary)" }}>Candidaturas Totais</p>
        </Card>
        <Card className="text-center">
          <h3 className="text-4xl font-bold text-warning mb-2">
            {applications.filter(a => ["NEW", "SCREENING", "EVALUATION"].includes(a.status)).length}
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>Em Análise</p>
        </Card>
        <Card className="text-center">
          <h3 className="text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {applications.filter(a => a.status === "INTERVIEW").length}
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>Entrevistas</p>
        </Card>
        <Card className="text-center">
          <h3 className="text-4xl font-bold text-success mb-2">
            {applications.filter(a => ["APPROVED", "HIRED"].includes(a.status)).length}
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>Aprovações</p>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Minhas Candidaturas</h2>
          <Link href="/vagas">
            <Button variant="outline">Buscar mais vagas</Button>
          </Link>
        </div>

        {applications.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                  <th className="pb-3">Vaga</th>
                  <th className="pb-3">Empresa</th>
                  <th className="pb-3">Data</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Ação</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td className="py-4 font-medium">{app.job.title}</td>
                    <td className="py-4 text-sm" style={{ color: "var(--text-secondary)" }}>Humanity</td>
                    <td className="py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                      {new Date(app.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-4">{getStatusBadge(app.status)}</td>
                    <td className="py-4">
                      <Link href={`/vagas/${app.job.id}`}>
                        <Button variant="outline">Ver Vaga</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>Você ainda não se candidatou a nenhuma vaga.</p>
            <Link href="/vagas">
              <Button variant="primary">Encontrar Vagas</Button>
            </Link>
          </div>
        )}
      </Card>

      <Card className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Minhas Experiências</h2>
          <Link href="/candidato/dashboard/experiencias">
            <Button variant="outline">Editar Experiências</Button>
          </Link>
        </div>

        {profile?.experiences && profile.experiences.length > 0 ? (
          <div className="flex flex-col gap-4">
            {profile.experiences.map((exp: any) => (
              <div key={exp.id} className="p-4 border rounded" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{exp.role}</h3>
                    <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{exp.company}</p>
                  </div>
                </div>
                <div className="text-sm whitespace-pre-wrap mt-2" style={{ color: "var(--text-primary)" }}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>Nenhuma experiência cadastrada.</p>
            <Link href="/candidato/dashboard/experiencias">
              <Button variant="primary">Adicionar Experiência</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
