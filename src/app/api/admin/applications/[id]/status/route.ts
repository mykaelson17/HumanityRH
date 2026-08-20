import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "RH", "RECRUITER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status não fornecido" }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });

    await prisma.applicationHistory.create({
      data: {
        applicationId: id,
        status: status,
        notes: `Status alterado para ${status} por ${(session.user as any).name}`
      }
    });

    if (status === "REJECTED") {
      const appWithUser = await prisma.application.findUnique({
        where: { id },
        include: { candidateProfile: { include: { user: true } } }
      });
      console.log(`[EMAIL SIMULATION] Enviando e-mail de feedback negativo para: ${appWithUser?.candidateProfile.user.email}`);
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }
}
