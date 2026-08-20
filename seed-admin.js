const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@humanity.com' },
    update: {
      password: passwordHash, // Ensure password is correct
      role: 'ADMIN',
    },
    create: {
      email: 'admin@humanity.com',
      name: 'Admin Humanity',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin account ready:', admin.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
