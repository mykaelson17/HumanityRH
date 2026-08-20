import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, FileText, Briefcase, LogOut } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export default async function CandidatoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "CANDIDATE") {
    redirect("/candidato/login");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
      {/* Sidebar */}
      <aside style={{ width: "250px", backgroundColor: "var(--bg-secondary)", borderRight: "1px solid var(--border-color)", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-brand">
            Humanity
          </Link>
          <div className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            Área do Candidato
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/candidato/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" style={{ color: "var(--text-primary)", fontWeight: "500" }}>
            <Briefcase size={20} /> Minhas Candidaturas
          </Link>
          <Link href="/candidato/dashboard/perfil" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" style={{ color: "var(--text-secondary)" }}>
            <User size={20} /> Meu Perfil
          </Link>
          <Link href="/candidato/dashboard/experiencias" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" style={{ color: "var(--text-secondary)" }}>
            <FileText size={20} /> Experiências
          </Link>
        </nav>

        <div className="mt-auto pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
