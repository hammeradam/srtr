import crypto from 'crypto';
import prisma from 'prisma';

export const generateName = async (length = 2): Promise<string> => {
    const name = crypto.randomBytes(length).toString('hex');
    if (await prisma.link.findFirst({ where: { name } })) {
        return generateName();
    }

    return name;
};
