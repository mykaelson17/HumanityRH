"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 p-2 w-full text-left"
      style={{ color: "var(--danger)", background: "transparent", border: "none", cursor: "pointer", fontWeight: "500" }}
    >
      <LogOut size={20} /> Sair
    </button>
  );
}
