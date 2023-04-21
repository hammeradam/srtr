import { hashSync } from 'bcrypt';
import { DatabaseAdapter } from 'controllers/authController';
import prisma from 'prisma';

export const prismaAdapter = (): DatabaseAdapter => {
    const findUser = ({
        id,
        email,
        verified,
    }: {
        id?: string;
        email?: string;
        verified?: boolean;
    }) => {
        return prisma.user.findFirst({
            where: {
                id,
                email,
                verified,
            },
        });
    };

    const createUser = ({
        name,
        email,
        verified = true,
    }: {
        name?: string;
        email?: string;
        verified?: boolean;
    }) => {
        return prisma.user.create({
            data: { name, email, verified },
        });
    };

    const updateUser = (
        id: string,
        data: {
            name?: string;
            email?: string;
            tokenVersion?: number;
            verified?: boolean;
        }
    ) => {
        return prisma.user.update({
            where: {
                id,
            },
            data,
        });
    };

    const findAuthMethod = (where: {
        type?: string;
        value?: string;
        userId?: string;
    }) => {
        return prisma.authMethod.findFirst({
            where,
            include: {
                user: true,
            },
        });
    };

    const createAuthMethod = (data: {
        type: string;
        value: string;
        userId: string;
        secret: string | null;
    }) => {
        return prisma.authMethod.create({
            data,
        });
    };

    const updateAuthMethod = (
        where: {
            type: string;
            userId: string;
        },
        data: {
            value?: string;
            secret?: string | null;
        }
    ) => {
        return prisma.authMethod.update({
            data,
            where: {
                type_userId: where,
            },
        });
    };

    const createToken = ({
        token,
        userId,
        type,
    }: {
        token: string;
        userId: string;
        type: 'reset-password' | 'login';
    }) => {
        return prisma.token.create({
            data: {
                content: hashSync(token, 10),
                userId,
                type,
            },
        });
    };

    const findToken = (where: {
        userId: string;
        type: 'reset-password' | 'login';
    }) => {
        return prisma.token.findFirst({
            where,
        });
    };

    const deleteToken = async (where: {
        userId: string;
        type: 'reset-password' | 'login';
    }) => {
        await prisma.token.deleteMany({
            where,
        });
    };

    return {
        createUser,
        findUser,
        updateUser,
        createAuthMethod,
        findAuthMethod,
        updateAuthMethod,
        createToken,
        findToken,
        deleteToken,
    };
};
