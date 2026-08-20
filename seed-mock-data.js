const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const JOB_TITLES = [
  "Desenvolvedor Front-end Pleno",
  "Engenheiro de Software Sênior",
  "Analista de Marketing Digital",
  "Designer UX/UI",
  "Gerente de Projetos (Scrum Master)",
  "Analista de Recursos Humanos",
  "Assistente Administrativo",
  "Desenvolvedor Back-end Júnior (Node.js)",
  "Especialista em Dados (Data Scientist)",
  "DevOps Engineer",
  "Consultor de Vendas B2B",
  "Coordenador Financeiro",
  "Analista de Suporte Técnico",
  "Redator Publicitário",
  "Arquiteto de Soluções Cloud",
  "Estagiário de Direito",
  "Analista de Qualidade (QA)",
  "Product Manager",
  "Tech Lead",
  "Especialista em Cibersegurança"
];

const DEPARTMENTS = ["Tecnologia", "Marketing", "RH", "Administrativo", "Vendas", "Financeiro", "Operações"];
const MODALITIES = ["Presencial", "Remoto", "Híbrido"];
const CONTRACTS = ["CLT (efetivo)", "Prestador de serviço (PJ)", "Estágio"];
const STATUSES = ["NEW", "SCREENING", "INTERVIEW", "EVALUATION", "APPROVED", "HIRED", "REJECTED"];
const CITIES = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Brasília", "Salvador"];
const STATES = ["SP", "RJ", "MG", "PR", "RS", "DF", "BA"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCPF() {
  return `${randomInt(100, 999)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(10, 99)}`;
}

async function main() {
  console.log("Limpando dados antigos de mock...");
  
  // Limpar candidatos e vagas geradas (não limpa o Admin)
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.user.deleteMany({
    where: { role: 'CANDIDATE' }
  });

  console.log("Inserindo 20 Vagas...");
  const jobs = [];
  for (let i = 0; i < 20; i++) {
    const minSalary = randomInt(2, 10) * 1000;
    const maxSalary = minSalary + randomInt(1, 5) * 1000;
    
    const job = await prisma.job.create({
      data: {
        title: JOB_TITLES[i],
        department: randomChoice(DEPARTMENTS),
        description: `Esta é uma excelente oportunidade para atuar como ${JOB_TITLES[i]} em nossa empresa inovadora.`,
        responsibilities: "Trabalhar em equipe.\nEntregar resultados.\nMelhoria contínua.",
        requirements: "Experiência prévia na área.\nBoa comunicação.\nProatividade.",
        differentials: "Inglês avançado.\nCertificações relevantes.",
        benefits: "Plano de Saúde.\nVale Refeição.\nGympass.",
        city: randomChoice(CITIES),
        state: randomChoice(STATES),
        modality: randomChoice(MODALITIES),
        contractType: randomChoice(CONTRACTS),
        minSalary: minSalary,
        maxSalary: maxSalary,
        status: "PUBLISHED",
        publishedAt: new Date(),
      }
    });
    jobs.push(job);
  }

  console.log("Inserindo 50 Candidatos...");
  const passwordHash = await bcrypt.hash('123456', 10);
  const candidates = [];

  for (let i = 1; i <= 50; i++) {
    const name = `Candidato Teste ${i}`;
    const email = `candidato${i}@teste.com`;
    const cpf = generateCPF();
    const city = randomChoice(CITIES);
    const state = randomChoice(STATES);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        phone: `(11) 99999-${randomInt(1000, 9999)}`,
        role: "CANDIDATE",
        candidateProfile: {
          create: {
            cpf,
            age: randomInt(20, 50),
            city,
            state,
            address: `Rua Teste, ${i}00`,
            zipCode: `01000-000`,
            inTalentPool: Math.random() > 0.5,
          }
        }
      },
      include: {
        candidateProfile: true
      }
    });
    candidates.push(user);
  }

  console.log("Distribuindo candidatos nas vagas (criando aplicações)...");
  
  for (const candidate of candidates) {
    // Cada candidato vai se inscrever em 1 a 4 vagas aleatórias
    const numApps = randomInt(1, 4);
    const appliedJobIds = new Set();
    
    for (let j = 0; j < numApps; j++) {
      const job = randomChoice(jobs);
      if (!appliedJobIds.has(job.id)) {
        appliedJobIds.add(job.id);
        
        const app = await prisma.application.create({
          data: {
            jobId: job.id,
            candidateProfileId: candidate.candidateProfile.id,
            status: randomChoice(STATUSES)
          }
        });
        
        // Criar um histórico
        await prisma.applicationHistory.create({
          data: {
            applicationId: app.id,
            status: app.status,
            notes: "Avaliação inicial do sistema."
          }
        });
      }
    }
  }

  console.log("Banco populado com sucesso! 20 vagas e 50 candidatos distribuídos.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
