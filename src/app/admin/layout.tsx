import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Briefcase, Users, Settings } from "lucide-react";
import { LogoutButton } from "../candidato/dashboard/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !["ADMIN", "RH", "RECRUITER"].includes((session.user as any).role)) {
    redirect("/candidato/login");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", backgroundColor: "var(--bg-secondary)", borderRight: "1px solid var(--border-color)", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        <div className="mb-8">
          <Link href="/admin/dashboard" className="text-2xl font-bold text-brand">
            MaisEmprego<span style={{ color: "var(--brand-accent)" }}>.aux</span> <span className="text-sm font-normal" style={{ color: "var(--text-secondary)" }}>Admin</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" style={{ color: "var(--text-primary)", fontWeight: "500" }}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/vagas" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" style={{ color: "var(--text-secondary)" }}>
            <Briefcase size={20} /> Gestão de Vagas
          </Link>
          <Link href="/admin/candidatos" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" style={{ color: "var(--text-secondary)" }}>
            <Users size={20} /> Banco de Talentos
          </Link>
          <Link href="/admin/configuracoes" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" style={{ color: "var(--text-secondary)" }}>
            <Settings size={20} /> Configurações
          </Link>
        </nav>

        <div className="mt-auto pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
          <div className="mb-4 px-2">
            <p className="font-bold text-sm">{session.user?.name}</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{(session.user as any).role}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto", maxHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
