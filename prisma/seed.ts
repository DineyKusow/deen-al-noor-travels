import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultUsers = [
  {
    name: 'Administrator',
    email: 'admin@deenalnoortravels.com',
    password: 'Admin@123',
    role: 'ADMIN'
  },
  {
    name: 'Finance Officer',
    email: 'finance@deenalnoortravels.com',
    password: 'Finance@123',
    role: 'FINANCE'
  },
  {
    name: 'Operations Staff',
    email: 'staff@deenalnoortravels.com',
    password: 'Staff@123',
    role: 'STAFF'
  }
] as const;

const defaultPackages = [
  {
    name: 'September Umrah Package',
    price: 130000,
    startDate: '2026-09-17T00:00:00.000Z',
    endDate: '2026-09-27T00:00:00.000Z',
    hotel: 'Makkah Clock Tower / Madinah',
    transport: 'Airport transfer + group coach',
    services: 'Visa, flights, hotel, transport, guidance'
  },
  {
    name: 'October Umrah Package',
    price: 130000,
    startDate: '2026-10-05T00:00:00.000Z',
    endDate: '2026-10-15T00:00:00.000Z',
    hotel: 'Premium hotel near Haram',
    transport: 'Airport transfer + coach',
    services: 'Visa, flights, hotel, transport, ziyarat'
  },
  {
    name: 'Fair Mount Five Star Package',
    price: 230000,
    startDate: '2026-11-01T00:00:00.000Z',
    endDate: '2026-11-12T00:00:00.000Z',
    hotel: 'Fair Mount Hotel',
    transport: 'VIP transport',
    services: 'Luxury accommodation, airport support, visa assistance'
  }
] as const;

async function main() {
  await Promise.all(
    defaultUsers.map(async (user) => {
      const existing = await prisma.user.findUnique({ where: { email: user.email } });
      if (!existing) {
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            password: await bcrypt.hash(user.password, 10),
            role: user.role
          }
        });
      }
    })
  );

  for (const pkg of defaultPackages) {
    await prisma.package.upsert({
      where: { name: pkg.name },
      update: {},
      create: pkg
    });
  }

  const admin = await prisma.user.findUnique({ where: { email: 'admin@deenalnoortravels.com' } });
  if (admin) {
    const count = await prisma.client.count();
    if (count === 0) {
      const pkg = await prisma.package.findFirst({ where: { name: 'September Umrah Package' } });
      await prisma.client.createMany({
        data: [
          {
            name: 'Aisha Mohamed',
            phone: '+254712111111',
            passportNumber: 'A1234567',
            packageName: pkg?.name ?? 'September Umrah Package',
            notes: 'Confirmed package',
            balance: 45000,
            userId: admin.id
          },
          {
            name: 'Yusuf Ali',
            phone: '+254721222222',
            passportNumber: 'B7654321',
            packageName: 'October Umrah Package',
            notes: 'Full payment received',
            balance: 0,
            userId: admin.id
          }
        ]
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
