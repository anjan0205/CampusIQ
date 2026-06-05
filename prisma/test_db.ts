import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
p.college.findMany({take: 1})
  .then(data => {
    console.log("Success! Data length:", data.length);
    console.log("First college:", data[0]?.name);
  })
  .catch(err => {
    console.error("Error running query:", err);
  })
  .finally(async () => {
    await p.$disconnect();
  });
