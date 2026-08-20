import Link from 'next/link';
import { Button } from '../ui/Button';

export const Header = () => {
  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div className="container flex items-center justify-between" style={{ height: '70px' }}>
        <Link href="/" className="text-2xl font-bold">
          <span style={{ color: "var(--brand-primary)" }}>Humanit</span>
          <span style={{ color: "var(--brand-accent)" }}>y</span>
        </Link>
        <nav className="flex gap-4 items-center ml-10">
          <Link href="/vagas" className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            Todas as Vagas
          </Link>
          <Link href="/para-empresas" className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            Para Empresas
          </Link>
          <Link href="/cursos" className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            Cursos
          </Link>
        </nav>
        <div className="flex gap-2 ml-auto">
          <Link href="/candidato/login">
            <Button variant="outline">Entrar</Button>
          </Link>
          <Link href="/candidato/cadastro">
            <Button variant="primary">Cadastre-se</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
