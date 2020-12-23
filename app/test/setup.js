module.exports = async () => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const keys = Object.keys(prisma);

  for (const modelName of keys) {
    if (!prisma[modelName].deleteMany) continue;
    console.log('deleting', modelName);
    await prisma[modelName].deleteMany();
    console.log('deleted', modelName);
  }

  console.log('all deleted');
};
