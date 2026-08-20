import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Humanity - Portal de Recrutamento",
  description: "Encontre oportunidades e faça parte do nosso time. Cadastre seu currículo e acompanhe processos seletivos.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Providers>
          <div style={{ flex: '1 0 auto' }}>
            {children}
          </div>
          <footer style={{ 
            flexShrink: 0,
            padding: '1rem', 
            textAlign: 'center', 
            fontSize: '0.75rem', 
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            opacity: 0.7
          }}>
            <span>Desenvolvido por</span>
            <img src="/impulse-logo.png" alt="Impulse Sistemas" style={{ height: '24px', objectFit: 'contain' }} />
          </footer>
        </Providers>
      </body>
    </html>
  );
}
