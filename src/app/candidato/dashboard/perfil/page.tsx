import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { candidateProfile: true }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Meu Perfil</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Mantenha seus dados atualizados para aumentar suas chances nas vagas.
      </p>
      <ProfileForm user={user} profile={user?.candidateProfile} />
    </div>
  );
}
