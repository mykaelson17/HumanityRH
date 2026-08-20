import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExperienceForm from "./ExperienceForm";

export default async function ExperienciasPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    include: { experiences: { orderBy: { startDate: "desc" } } }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quais são suas experiências</h1>
      </div>
      <ExperienceForm initialExperiences={profile?.experiences || []} />
    </div>
  );
}
