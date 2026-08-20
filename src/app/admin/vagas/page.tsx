import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Users, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminVagas() {
  const vagas = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true }
      }
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestão de Vagas</h1>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus size={20} /> Nova Vaga
        </Button>
      </div>

      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <th className="pb-3">Cargo</th>
                <th className="pb-3">Departamento</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-center">Candidatos</th>
                <th className="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vagas.map((vaga) => (
                <tr key={vaga.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td className="py-4 font-medium">{vaga.title}</td>
                  <td className="py-4" style={{ color: "var(--text-secondary)" }}>{vaga.department}</td>
                  <td className="py-4">
                    <span className={`badge ${vaga.status === 'PUBLISHED' ? 'badge-success' : 'badge-neutral'}`}>
                      {vaga.status === 'PUBLISHED' ? 'Publicada' : vaga.status}
                    </span>
                  </td>
                  <td className="py-4 text-center font-bold">
                    {vaga._count.applications}
                  </td>
                  <td className="py-4 text-right flex justify-end gap-2">
                    <Link href={`/admin/vagas/${vaga.id}`}>
                      <Button variant="primary" className="p-2" title="Ver Candidatos">
                        <Users size={18} /> Candidatos
                      </Button>
                    </Link>
                    <Button variant="outline" className="p-2" title="Editar">
                      <Edit size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
              {vagas.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center" style={{ color: "var(--text-secondary)" }}>
                    Nenhuma vaga cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
