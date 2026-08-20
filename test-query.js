const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const login = "admin@humanity.com";
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: login },
          {
            candidateProfile: {
              cpf: login,
            }
          }
        ]
      }
    });
    console.log("User found:", user);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}

main().finally(() => prisma.$disconnect());
