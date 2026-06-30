import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@flatfinder.local',
      password,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  const demo = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@flatfinder.local',
      password,
      name: 'Demo User',
      role: 'USER',
    },
  });

  const tag1 = await prisma.apartmentTag.upsert({
    where: { name: 'центр' },
    update: {},
    create: { name: 'центр' },
  });
  const tag2 = await prisma.apartmentTag.upsert({
    where: { name: 'новый дом' },
    update: {},
    create: { name: 'новый дом' },
  });
  const tag3 = await prisma.apartmentTag.upsert({
    where: { name: 'с ремонтом' },
    update: {},
    create: { name: 'с ремонтом' },
  });

  const apt1 = await prisma.apartment.create({
    data: {
      title: 'Уютная 2-комната в центре',
      source: 'MANUAL',
      price: 85000,
      currency: 'RUB',
      city: 'Москва',
      district: 'Тверской',
      rooms: 2,
      area: 54,
      floor: 5,
      totalFloors: 9,
      status: 'ACTIVE',
      assigneeId: demo.id,
      description: 'Светлая квартира с хорошим ремонтом, рядом метро.',
      tags: { connect: [{ id: tag1.id }, { id: tag3.id }] },
    },
  });

  const apt2 = await prisma.apartment.create({
    data: {
      title: 'Студия у парка Горького',
      source: 'LINK',
      sourceUrl: 'https://example.com/flat/1',
      price: 65000,
      currency: 'RUB',
      city: 'Москва',
      district: 'Донской',
      rooms: 0,
      area: 28,
      floor: 3,
      totalFloors: 12,
      status: 'NEW',
      assigneeId: demo.id,
      description: 'Новый дом, панорамные окна, своя парковка.',
      tags: { connect: [{ id: tag2.id }] },
    },
  });

  await prisma.apartment.create({
    data: {
      title: '3-комната с видом на Неву',
      source: 'MANUAL',
      price: 1200,
      currency: 'EUR',
      city: 'Санкт-Петербург',
      district: 'Василеостровский',
      rooms: 3,
      area: 92,
      floor: 7,
      totalFloors: 16,
      status: 'CALLBACK',
      assigneeId: demo.id,
      description: 'Премиальный ЖК, охрана, подземный паркинг.',
      tags: { connect: [{ id: tag3.id }] },
    },
  });

  console.log(`Seed complete: ${apt1.id}, ${apt2.id}`);
  console.log('Demo accounts: admin / demo — password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
