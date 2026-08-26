"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutDashboard, LogOut, User, BriefcaseBusiness } from "lucide-react";

export const Header = () => {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "";
  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "";
  const isAdmin = (user as any)?.role && (user as any)?.role !== "CANDIDATE";
  const dashboardHref = isAdmin ? "/admin/dashboard" : "/candidato/dashboard";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={{
      borderBottom: "1px solid var(--border-color)",
      backgroundColor: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div className="container flex items-center justify-between" style={{ height: "68px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.375rem", textDecoration: "none" }}>
          <div style={{
            width: "32px", height: "32px",
            background: "var(--brand-gradient)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BriefcaseBusiness size={18} color="white" />
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--brand-primary)", letterSpacing: "-0.03em" }}>
            MaisEmprego<span style={{ color: "var(--brand-accent)" }}>.aux</span>
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", gap: "0.25rem", alignItems: "center", marginLeft: "2.5rem" }}>
          {[
            { href: "/vagas", label: "Vagas" },
            { href: "/para-empresas", label: "Para Empresas" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "0.45rem 0.875rem",
                borderRadius: "var(--border-radius-md)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                transition: "var(--transition)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {status === "loading" ? (
            <div style={{ width: "120px", height: "36px", borderRadius: "var(--border-radius-md)", background: "#F3F4F6" }} />
          ) : user ? (
            /* Usuário logado — avatar + dropdown */
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.4rem 0.625rem 0.4rem 0.4rem",
                  borderRadius: "var(--border-radius-full)",
                  border: "1.5px solid var(--border-color)",
                  background: "white",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  boxShadow: dropdownOpen ? "0 0 0 3px rgba(124,58,237,0.12)" : "none",
                  borderColor: dropdownOpen ? "var(--brand-primary)" : "var(--border-color)",
                }}
              >
                <div className="avatar" style={{ width: "28px", height: "28px", fontSize: "0.7rem" }}>
                  {initials}
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {firstName}
                </span>
                <ChevronDown
                  size={14}
                  color="var(--text-tertiary)"
                  style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="animate-slideDown"
                  style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    width: "220px",
                    background: "white",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--border-radius-lg)",
                    boxShadow: "var(--shadow-lg)",
                    overflow: "hidden",
                    zIndex: 100,
                  }}
                >
                  {/* User Info */}
                  <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)", background: "var(--bg-primary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div className="avatar avatar-sm">{initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.name}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: "0.375rem" }}>
                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.625rem",
                        padding: "0.625rem 0.75rem",
                        borderRadius: "var(--border-radius-md)",
                        fontSize: "0.875rem", fontWeight: 500,
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                      }}
                    >
                      <LayoutDashboard size={16} />
                      Meu Dashboard
                    </Link>
                    {!isAdmin && (
                      <Link
                        href="/candidato/dashboard/perfil"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.625rem",
                          padding: "0.625rem 0.75rem",
                          borderRadius: "var(--border-radius-md)",
                          fontSize: "0.875rem", fontWeight: 500,
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                          transition: "var(--transition)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)";
                          (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                        }}
                      >
                        <User size={16} />
                        Meu Perfil
                      </Link>
                    )}
                  </div>

                  <div style={{ borderTop: "1px solid var(--border-color)", padding: "0.375rem" }}>
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setDropdownOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.625rem",
                        width: "100%", padding: "0.625rem 0.75rem",
                        borderRadius: "var(--border-radius-md)",
                        fontSize: "0.875rem", fontWeight: 500,
                        color: "var(--danger)",
                        background: "none", border: "none", cursor: "pointer",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--danger-bg)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Usuário deslogado */
            <>
              <Link
                href="/candidato/login"
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: "var(--border-radius-md)",
                  fontSize: "0.875rem", fontWeight: 600,
                  color: "var(--brand-primary)",
                  border: "1.5px solid var(--brand-primary)",
                  background: "transparent",
                  transition: "var(--transition)",
                  textDecoration: "none",
                  display: "inline-flex", alignItems: "center",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--brand-primary-light)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                Entrar
              </Link>
              <Link
                href="/candidato/cadastro"
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: "var(--border-radius-md)",
                  fontSize: "0.875rem", fontWeight: 600,
                  color: "white",
                  background: "var(--brand-gradient)",
                  boxShadow: "var(--shadow-brand-sm)",
                  transition: "var(--transition)",
                  textDecoration: "none",
                  display: "inline-flex", alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-brand)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-brand-sm)";
                }}
              >
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
