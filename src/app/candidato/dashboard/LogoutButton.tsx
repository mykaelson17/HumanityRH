"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        padding: "0.65rem 0.875rem",
        width: "100%",
        borderRadius: "var(--border-radius-md)",
        border: "none",
        background: "rgba(239,68,68,0.12)",
        color: "rgba(252,165,165,1)",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "0.875rem",
        transition: "var(--transition)",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.22)";
        (e.currentTarget as HTMLElement).style.color = "#FCA5A5";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.12)";
        (e.currentTarget as HTMLElement).style.color = "rgba(252,165,165,1)";
      }}
    >
      <LogOut size={16} />
      Sair da conta
    </button>
  );
}
