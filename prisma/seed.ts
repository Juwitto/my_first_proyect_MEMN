import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const tenant = await prisma.tenant.create({
    data: { name: 'Tenant Demo' },
  });

  await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: hashedPassword,
      role: 'admin',
      tenantId: tenant.id,
    },
  });

  console.log('Seed completado ✅');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });