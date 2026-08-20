import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      socialName,
      secondaryEmail,
      cpf,
      phone,
      birthDate,
      age,
      zipCode,
      address,
      city,
      state,
      linkedin,
      deficiency,
      sex,
      gender,
      race,
      sexualOrientation,
      summary
    } = body;

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId }
    });

    if (!profile) return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });

    await prisma.$transaction([
      prisma.candidateProfile.update({
        where: { userId },
        data: {
          socialName,
          secondaryEmail,
          cpf,
          birthDate: birthDate ? new Date(birthDate) : undefined,
          age: age ? parseInt(String(age)) : undefined,
          zipCode,
          address,
          city,
          state,
          linkedin,
          deficiency,
          sex,
          gender,
          race,
          sexualOrientation,
          summary
        }
      }),
      ...(phone ? [
        prisma.user.update({
          where: { id: userId },
          data: { phone }
        })
      ] : [])
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}
