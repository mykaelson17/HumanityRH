import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import VagasClient from "./VagasClient";

export const dynamic = "force-dynamic";

export default async function VagasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  
  const jobs = await prisma.job.findMany({
    where: {
      status: "PUBLISHED",
      ...(q ? {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ]
      } : {})
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <main style={{ flex: 1, backgroundColor: "var(--bg-tertiary)", padding: "2rem 0" }}>
        <VagasClient jobs={jobs} initialQuery={q} />
      </main>
    </div>
  );
}
