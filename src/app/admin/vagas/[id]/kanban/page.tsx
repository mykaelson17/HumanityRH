import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import KanbanBoard from "./KanbanBoard";
import Link from "next/link";

export default async function KanbanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      applications: {
        include: {
          candidateProfile: {
            include: { user: true, skills: { include: { skill: true } } }
          }
        }
      }
    }
  });

  if (!job) notFound();

  // Serializing for client component
  const applications = job.applications.map(app => ({
    id: app.id,
    status: app.status,
    candidateName: app.candidateProfile.user.name,
    candidateCity: app.candidateProfile.city,
    candidateAge: app.candidateProfile.birthDate ? new Date().getFullYear() - new Date(app.candidateProfile.birthDate).getFullYear() : null,
    skillsCount: app.candidateProfile.skills.length,
    candidateId: app.candidateProfile.userId,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="mb-2">
            <Link href="/admin/vagas" className="text-brand flex items-center gap-1 font-medium">
              &larr; Voltar
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Kanban: {job.title}</h1>
          <p style={{ color: "var(--text-secondary)" }}>Gerencie os candidatos arrastando-os entre as colunas.</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowX: "auto" }}>
        <KanbanBoard initialApplications={applications} />
      </div>
    </div>
  );
}
