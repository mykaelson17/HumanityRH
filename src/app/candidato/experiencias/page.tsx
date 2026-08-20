import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import ExperienceForm from "./ExperienceForm";

export default async function ExperienciasPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    include: { experiences: true }
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-tertiary)" }}>
      <Header />
      <div className="container" style={{ flex: 1, padding: "2rem 0", maxWidth: "800px", margin: "0 auto" }}>
        <h1 className="text-2xl font-bold mb-6">Editar Minhas Experiências</h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          Edite o texto extraído do seu currículo ou adicione novas experiências para que os recrutadores possam te encontrar por palavras-chaves.
        </p>
        <ExperienceForm initialExperiences={profile?.experiences || []} />
      </div>
    </div>
  );
}
