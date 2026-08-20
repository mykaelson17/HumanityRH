import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10)

  // 1. Criar Usuários Administrativos
  const admin = await prisma.user.upsert({
    where: { email: 'admin@humanity.com' },
    update: {},
    create: {
      email: 'admin@humanity.com',
      name: 'Administrador',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  const rh = await prisma.user.upsert({
    where: { email: 'rh@humanity.com' },
    update: {},
    create: {
      email: 'rh@humanity.com',
      name: 'Gestor RH',
      password: passwordHash,
      role: 'RH',
    },
  })

  console.log('Admin e RH criados')

  // 2. Criar Habilidades
  const skillsList = [
    'Excel', 'Word', 'Atendimento', 'Vendas', 'Liderança', 
    'Comunicação', 'Administração', 'Informática', 'Marketing', 'Gestão',
    'React', 'Node.js', 'Inglês Fluente', 'Espanhol Básico'
  ]

  for (const skillName of skillsList) {
    await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName },
    })
  }

  console.log('Habilidades criadas')

  // 3. Criar Vagas
  const jobsData = [
    {
      title: 'Auxiliar Administrativo',
      department: 'Administração',
      description: 'Responsável por auxiliar nas rotinas administrativas da empresa, atendimento ao cliente e controle de planilhas.',
      responsibilities: '- Atendimento telefônico\n- Controle de planilhas\n- Organização de arquivos',
      requirements: '- Ensino Médio Completo\n- Conhecimento em Pacote Office',
      differentials: '- Experiência prévia na função\n- Curso técnico em Administração',
      benefits: '- Vale Transporte\n- Vale Refeição\n- Plano de Saúde',
      city: 'São Paulo',
      state: 'SP',
      modality: 'Presencial',
      contractType: 'CLT',
      minSalary: 2000,
      maxSalary: 2500,
      workHours: 'Segunda a Sexta, 08:00 às 17:00',
      vacancies: 2,
    },
    {
      title: 'Desenvolvedor Frontend Junior',
      department: 'Tecnologia',
      description: 'Buscamos um desenvolvedor frontend apaixonado por criar interfaces incríveis e modernas.',
      responsibilities: '- Desenvolvimento de componentes React\n- Integração com APIs REST\n- Ajustes de layout e responsividade',
      requirements: '- Experiência com React e CSS\n- Conhecimento de Git',
      differentials: '- Conhecimento em Next.js',
      benefits: '- Vale Alimentação\n- Plano de Saúde\n- Auxílio Home Office',
      city: 'Remoto',
      state: 'RM',
      modality: 'Remoto',
      contractType: 'CLT',
      minSalary: 3000,
      maxSalary: 4500,
      workHours: 'Horário flexível',
      vacancies: 1,
    },
    {
      title: 'Gerente de Vendas',
      department: 'Comercial',
      description: 'Procuramos um líder focado em resultados para nossa equipe comercial.',
      responsibilities: '- Liderar equipe de vendas\n- Definir metas e estratégias',
      requirements: '- Ensino Superior Completo\n- Experiência com gestão de equipes',
      differentials: '- MBA em Gestão Comercial',
      benefits: '- Comissões\n- Carro da empresa',
      city: 'Rio de Janeiro',
      state: 'RJ',
      modality: 'Híbrido',
      contractType: 'PJ',
      minSalary: 8000,
      maxSalary: 12000,
      workHours: 'Comercial',
      vacancies: 1,
    }
  ]

  for (const job of jobsData) {
    await prisma.job.create({
      data: job
    })
  }
  console.log('Vagas criadas')

  // 4. Criar Candidatos
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Candidato ${i}`,
        email: `candidato${i}@humanity.com`,
        password: passwordHash,
        role: 'CANDIDATE',
        phone: `1199999000${i}`,
        candidateProfile: {
          create: {
            cpf: `1234567890${i}`,
            city: 'São Paulo',
            state: 'SP',
            experiences: {
              create: [
                {
                  company: 'Empresa X',
                  role: 'Assistente',
                  startDate: new Date('2020-01-01'),
                  endDate: new Date('2022-12-31'),
                  description: 'Rotinas administrativas'
                }
              ]
            },
            educations: {
              create: [
                {
                  level: 'Ensino Superior Incompleto',
                  institution: 'Universidade Y',
                  course: 'Administração',
                  status: 'Cursando',
                  endYear: 2025
                }
              ]
            }
          }
        }
      }
    })
  }
  
  console.log('Candidatos criados')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
