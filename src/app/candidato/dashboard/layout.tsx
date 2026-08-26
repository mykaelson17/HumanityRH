import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, User, BookOpen, LogOut, BriefcaseBusiness, ChevronRight } from "lucide-react";
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

  const userName = session.user?.name ?? "Candidato";
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const navItems = [
    { href: "/candidato/dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/candidato/dashboard/candidaturas", label: "Candidaturas", icon: FileText },
    { href: "/candidato/dashboard/perfil", label: "Meu Perfil", icon: User },
    { href: "/candidato/dashboard/experiencias", label: "Experiências", icon: BookOpen },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside style={{
        width: "260px",
        minWidth: "260px",
        backgroundColor: "var(--bg-sidebar)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "1.5rem 1.25rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{
              width: "32px", height: "32px",
              background: "var(--brand-gradient)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <BriefcaseBusiness size={18} color="white" />
            </div>
            <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
              MaisEmprego<span style={{ color: "#FB923C" }}>.aux</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div style={{
          padding: "1.25rem",
          margin: "1rem 1rem 0.5rem",
          borderRadius: "var(--border-radius-lg)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "42px", height: "42px",
              borderRadius: "50%",
              background: "var(--brand-gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem", fontWeight: 700, color: "white",
              flexShrink: 0,
              boxShadow: "0 0 0 2px rgba(139,92,246,0.4)",
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: "0.875rem", fontWeight: 700, color: "white",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {userName.split(" ")[0]}
              </p>
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "0.1rem 0.5rem",
                borderRadius: "99px",
                background: "rgba(139,92,246,0.3)",
                color: "#C4B5FD",
                fontSize: "0.65rem", fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}>
                Candidato
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "0.5rem 0.875rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.5rem 0.25rem 0.25rem", marginTop: "0.25rem" }}>
            Menu
          </p>

          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.65rem 0.875rem",
                borderRadius: "var(--border-radius-md)",
                fontSize: "0.875rem", fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.08)";
                el.style.color = "rgba(255,255,255,0.95)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              <span style={{
                width: "30px", height: "30px",
                borderRadius: "var(--border-radius-sm)",
                background: "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={15} color="rgba(255,255,255,0.85)" />
              </span>
              <span style={{ flex: 1 }}>{label}</span>
              <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
            </Link>
          ))}
        </nav>

        {/* Find jobs link */}
        <div style={{ padding: "0.875rem" }}>
          <Link
            href="/vagas"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              padding: "0.65rem",
              borderRadius: "var(--border-radius-md)",
              background: "var(--brand-gradient)",
              color: "white",
              fontSize: "0.8125rem", fontWeight: 700,
              textDecoration: "none",
              transition: "var(--transition)",
              boxShadow: "var(--shadow-brand-sm)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            <BriefcaseBusiness size={15} />
            Ver Vagas Disponíveis
          </Link>
        </div>

        {/* Logout */}
        <div style={{ padding: "0.875rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}>
        {/* Top bar */}
        <div style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "var(--shadow-xs)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-tertiary)" }}>Olá,</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {userName.split(" ")[0]} 👋
            </span>
          </div>
          <Link
            href="/vagas"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.375rem",
              fontSize: "0.8125rem", fontWeight: 600, color: "var(--brand-primary)",
              textDecoration: "none",
              padding: "0.4rem 0.875rem",
              borderRadius: "var(--border-radius-md)",
              border: "1.5px solid var(--brand-primary)",
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--brand-primary-light)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <BriefcaseBusiness size={14} />
            Buscar Vagas
          </Link>
        </div>

        <div style={{ flex: 1, padding: "2rem" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
