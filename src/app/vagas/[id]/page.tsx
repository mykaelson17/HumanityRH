import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, Clock, Building } from "lucide-react";
import { ApplyButton } from "./ApplyButton";

export default async function VagaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    notFound();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <main style={{ flex: 1, backgroundColor: "var(--bg-tertiary)", padding: "2rem 0" }}>
        <div className="container">
          
          <div className="mb-4">
            <Link href="/vagas" className="text-brand flex items-center gap-1 font-medium">
              &larr; Voltar para vagas
            </Link>
          </div>

          <div className="grid md:flex-row gap-8" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="md:w-2/3 flex-1" style={{ flex: '2' }}>
              <Card className="mb-6">
                <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                <p className="text-lg mb-6" style={{ color: "var(--text-secondary)" }}>{job.department}</p>
                
                <div className="flex flex-wrap gap-6 mb-8" style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                  <span className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                    <MapPin size={20} /> {job.city} - {job.state}
                  </span>
                  <span className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                    <Briefcase size={20} /> {job.modality}
                  </span>
                  <span className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                    <Building size={20} /> {job.contractType}
                  </span>
                  <span className="flex items-center gap-2 font-medium" style={{ color: "var(--success)" }}>
                    <span className="font-bold">R$</span> {job.minSalary ? `${job.minSalary} - ${job.maxSalary}` : "A combinar"}
                  </span>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Sobre a vaga</h2>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    {job.description}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Responsabilidades</h2>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    {job.responsibilities}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Requisitos</h2>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    {job.requirements}
                  </div>
                </div>

                {job.differentials && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Diferenciais</h2>
                    <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      {job.differentials}
                    </div>
                  </div>
                )}

                {job.benefits && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Benefícios</h2>
                    <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      {job.benefits}
                    </div>
                  </div>
                )}
              </Card>
            </div>
            
            <div className="md:w-1/3" style={{ flex: '1' }}>
              <div style={{ position: 'sticky', top: '100px' }}>
                <Card>
                  <h3 className="text-xl font-bold mb-4">Resumo da Vaga</h3>
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Clock size={20} className="text-brand" style={{ marginTop: '2px' }} />
                      <div>
                        <p className="font-medium text-sm">Horário</p>
                        <p style={{ color: "var(--text-secondary)" }}>{job.workHours || "Não informado"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase size={20} className="text-brand" style={{ marginTop: '2px' }} />
                      <div>
                        <p className="font-medium text-sm">Vagas</p>
                        <p style={{ color: "var(--text-secondary)" }}>{job.vacancies}</p>
                      </div>
                    </div>
                  </div>

                  <ApplyButton jobId={job.id} />
                  <p className="text-center text-sm mt-4" style={{ color: "var(--text-tertiary)" }}>
                    Se você não tem cadastro, será redirecionado para criar um.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
