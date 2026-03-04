import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prisma ?? prismaClientSingleton();

// Waxaan kuu soo jeedinayaa inaad sidan u bixiso magaca si uu u fududaado import-ka
export const prisma = db; 
export default db;

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;