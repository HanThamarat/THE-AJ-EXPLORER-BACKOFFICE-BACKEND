import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient({
    transactionOptions: {
        maxWait: 100000,
        timeout: 200000,
    }
});