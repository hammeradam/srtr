import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

export default global.prisma ||
    new PrismaClient({
        log: ['query'],
    });

export * from '@prisma/client';
