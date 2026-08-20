import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const settingsList = await prisma.siteSetting.findMany();
  const settings = settingsList.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  const images = await prisma.heroImage.findMany({ orderBy: { order: "asc" } });

  return NextResponse.json({ settings, images });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image") as File | null;
      const targetField = formData.get("targetField") as string | null;

      if (!file) return NextResponse.json({ error: "Nenhuma imagem" }, { status: 400 });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const filepath = path.join(process.cwd(), "public", "uploads", "hero", filename);
      
      await writeFile(filepath, buffer);
      const url = `/uploads/hero/${filename}`;

      if (targetField) {
        await prisma.siteSetting.upsert({
          where: { key: targetField },
          update: { value: url },
          create: { key: targetField, value: url }
        });
        return NextResponse.json({ message: "Imagem salva na configuração", url });
      } else {
        const currentImagesCount = await prisma.heroImage.count();
        if (currentImagesCount >= 7) {
          return NextResponse.json({ error: "Limite de 7 imagens atingido" }, { status: 400 });
        }
        const newImage = await prisma.heroImage.create({
          data: { url, order: currentImagesCount }
        });
        return NextResponse.json({ message: "Imagem salva", image: newImage });
      }
    } else {
      const data = await request.json();
      
      for (const [key, value] of Object.entries(data)) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string }
        });
      }

      return NextResponse.json({ message: "Configurações salvas" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
