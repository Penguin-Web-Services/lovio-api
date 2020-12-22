module.exports = async () => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  const keys = Object.keys(prisma);

  for (const modelName of keys) {
    console.log(modelName);
    if (!prisma[modelName].deleteMany) continue;
    console.log('deleting');
    await prisma[modelName].deleteMany();
    console.log('deleted');
  }

  console.log('all deleted');
};
