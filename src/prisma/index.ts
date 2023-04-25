import { Prisma, PrismaClient } from '@prisma/client';

const prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    'info' | 'warn' | 'error' | 'query'
> = new PrismaClient({
    log: [
        {
            emit: 'stdout',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
    ],
});

prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Duration: ' + e.duration + 'ms');
});

export default prisma;
export * from '@prisma/client';
