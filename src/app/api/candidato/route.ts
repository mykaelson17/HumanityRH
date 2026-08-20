import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const ageStr = formData.get("age") as string;
    
    // Novas propriedades
    const cpf = formData.get("cpf") as string;
    const birthDate = formData.get("birthDate") as string;
    const cep = formData.get("cep") as string;
    const address = formData.get("address") as string;
    const neighborhood = formData.get("neighborhood") as string; // Will just append to address or save to city maybe? Wait, we don't have neighborhood in schema. I'll append to address.
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    const file = formData.get("resume") as File | null;

    // Validate required fields
    if (!email || !password || !name || !cpf) {
      return NextResponse.json({ error: "Preencha os campos obrigatórios (incluindo CPF)" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
    }

    const existingCpf = await prisma.candidateProfile.findUnique({
      where: { cpf }
    });

    if (existingCpf) {
      return NextResponse.json({ error: "CPF já cadastrado" }, { status: 400 });
    }

    let resumeUrl = null;

    if (file && file.size > 0) {
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Erro no upload do Supabase:", error);
        return NextResponse.json({ error: "Erro ao fazer upload do currículo" }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filename);
        
      resumeUrl = publicUrlData.publicUrl;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const fullAddress = neighborhood ? `${address}, ${neighborhood}` : address;

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        phone,
        role: "CANDIDATE",
        candidateProfile: {
          create: {
            age: ageStr ? parseInt(ageStr, 10) : null,
            cpf,
            birthDate: birthDate ? new Date(birthDate) : null,
            zipCode: cep,
            address: fullAddress,
            city,
            state,
            resumeUrl,
          }
        }
      },
    });

    return NextResponse.json({ message: "Cadastro realizado com sucesso" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao realizar cadastro" }, { status: 500 });
  }
}
