import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Search, MapPin, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BancoDeTalentos({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;

  const candidates = await prisma.candidateProfile.findMany({
    where: {
      OR: q ? [
        { user: { name: { contains: q } } },
        { city: { contains: q } },
      ] : undefined
    },
    include: {
      user: true,
      skills: { include: { skill: true } },
      experiences: { orderBy: { startDate: "desc" }, take: 1 }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Banco de Talentos</h1>
        <p style={{ color: "var(--text-secondary)" }}>Pesquise e filtre todos os candidatos cadastrados na plataforma.</p>
      </div>

      <Card className="mb-8">
        <form className="flex gap-4 items-end">
          <div className="input-group flex-1 m-0">
            <label className="input-label">Pesquisar por Nome, Cidade ou Habilidade</label>
            <div className="flex items-center bg-white border rounded-md px-3" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-primary)" }}>
              <Search size={18} style={{ color: "var(--text-tertiary)" }} />
              <input 
                type="text" 
                name="q" 
                defaultValue={q}
                className="w-full bg-transparent border-none p-2 outline-none" 
                placeholder="Ex: João, São Paulo, React..."
                style={{ width: "100%", backgroundColor: "transparent", border: "none", outline: "none", padding: "0.5rem" }}
              />
            </div>
          </div>
          <Button type="submit" variant="primary">Filtrar</Button>
        </form>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{candidate.user.name}</h3>
                <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <MapPin size={14} /> {candidate.city || "Não informado"} - {candidate.state}
                </span>
              </div>
            </div>

            <div className="mb-4 flex-1">
              {candidate.experiences.length > 0 ? (
                <div>
                  <p className="text-sm font-medium mb-1">Última Experiência:</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {candidate.experiences[0].role} na {candidate.experiences[0].company}
                  </p>
                </div>
              ) : (
                <p className="text-sm italic" style={{ color: "var(--text-tertiary)" }}>Sem experiências cadastradas</p>
              )}
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 3).map(cs => (
                  <span key={cs.skill.id} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {cs.skill.name}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>+{candidate.skills.length - 3}</span>
                )}
                {candidate.skills.length === 0 && (
                  <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Nenhuma habilidade listada</span>
                )}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
              <Button variant="outline" fullWidth>Ver Perfil Completo</Button>
            </div>
          </Card>
        ))}

        {candidates.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>Nenhum candidato encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
