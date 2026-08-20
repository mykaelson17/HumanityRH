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

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    
    if (!profile) {
      return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const { id, company, role, startDate, description } = body;

    if (id) {
      // Update existing
      const updated = await prisma.candidateExperience.update({
        where: { id },
        data: { 
          company, 
          role, 
          startDate: startDate ? new Date(startDate) : undefined, 
          description 
        }
      });
      return NextResponse.json(updated);
    } else {
      // Create new
      const created = await prisma.candidateExperience.create({
        data: {
          candidateProfileId: profile.id,
          company,
          role,
          startDate: new Date(startDate || Date.now()),
          description
        }
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao salvar experiência" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    await prisma.candidateExperience.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}
