import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CandidateViewer from "./CandidateViewer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ViewCandidatosVaga({
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
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!job) notFound();

  // Serializing data for client component
  const applications = job.applications.map(app => ({
    id: app.id,
    status: app.status,
    candidateName: app.candidateProfile.user.name || "Sem Nome",
    candidateEmail: app.candidateProfile.user.email || "",
    candidateAge: app.candidateProfile.age,
    candidatePhone: app.candidateProfile.user.phone,
    resumeUrl: app.candidateProfile.resumeUrl,
    createdAt: app.createdAt.toISOString(),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 4rem)" }}>
      <div className="mb-4">
        <Link href="/admin/vagas" className="flex items-center gap-1 text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
          <ArrowLeft size={16} /> Voltar para Vagas
        </Link>
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Data da criação: {new Date(job.createdAt).toLocaleDateString("pt-BR")} • {applications.length} candidatos
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <CandidateViewer initialApplications={applications} />
      </div>
    </div>
  );
}
