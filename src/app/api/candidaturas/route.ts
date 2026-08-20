import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "CANDIDATE") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: "ID da vaga não fornecido" }, { status: 400 });
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil do candidato não encontrado" }, { status: 404 });
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_candidateProfileId: {
          jobId,
          candidateProfileId: profile.id,
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json({ error: "Você já se candidatou a esta vaga" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        candidateProfileId: profile.id,
        status: "NEW"
      }
    });

    await prisma.applicationHistory.create({
      data: {
        applicationId: application.id,
        status: "NEW",
        notes: "Candidatura recebida"
      }
    });

    return NextResponse.json({ message: "Candidatura realizada com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao processar candidatura" }, { status: 500 });
  }
}
