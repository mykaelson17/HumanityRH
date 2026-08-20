# Projeto Humanity — Portal de Recrutamento

Este é o profile/contexto do projeto para o Google Antigravity (AGY).

## Escopo do Projeto
O Humanity é uma plataforma completa (SaaS) de recrutamento e seleção. Ele centraliza vagas, currículos e processos seletivos.
- **Público:** Candidatos (que buscam vagas) e RH/Admin (que gerenciam vagas e recrutamento).
- **Recursos Principais:** 
  - Candidato: Busca de vagas, Wizard de cadastro de currículo, Dashboard de acompanhamento (Kanban tracking).
  - RH: Dashboard gerencial, CRUD de vagas, Kanban interativo de candidatos (Drag & Drop), Banco de Talentos com filtros.

## Stack Tecnológica
- **Framework:** Next.js 15 (App Router)
- **Estilização:** Vanilla CSS (CSS puro, variáveis CSS, sem Tailwind) com Design System próprio roxo/branco.
- **Banco de Dados:** SQLite (via Prisma ORM) para desenvolvimento local.
- **Autenticação:** NextAuth.js (Credentials Provider) com criptografia bcryptjs.
- **Deploy:** Dockerizado (Dockerfile e docker-compose.yml na raiz), configurado com output "standalone".

## Convenções de Código
- **Componentes:** Separados em `src/components/ui/` para componentes base (Card, Button) e `src/components/layout/` para blocos estruturais (Header).
- **Client Components:** Só usar `"use client"` quando necessário (ex: estados de interface, DnD do Kanban, modal de filtros).
- **Server Components:** Utilizar por padrão para buscar dados do Prisma (`src/app/...`).
- **CSS:** As variáveis de design estão centralizadas em `src/app/globals.css`. Respeitar as cores do sistema (`--brand-primary`, etc).

## Rotas Principais
- `/`: Landing page de apresentação e busca flutuante.
- `/vagas`: Listagem de vagas com alternância Grid/Lista e modal de filtros.
- `/candidato/*`: Área do candidato (cadastro, login, dashboard).
- `/admin/*`: Área gerencial (dashboard, vagas, kanban, banco de talentos).

## Contas de Teste Locais
- **Admin:** admin@humanity.com / 123456
- **Candidato:** candidato1@humanity.com / 123456
