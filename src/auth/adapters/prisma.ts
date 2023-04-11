import { hashSync } from 'bcrypt';
import prisma from 'prisma';

export const prismaAdapter = () => {
    const findUser = ({
        id,
        email,
        githubId,
        googleId,
    }: {
        id?: string;
        email?: string;
        githubId?: number;
        googleId?: string;
    }) => {
        return prisma.user.findFirst({
            where: {
                id,
                email,
                githubId,
                googleId,
            },
        });
    };

    const createUser = ({
        email,
        password,
        name,
        githubId,
        googleId,
    }: {
        name?: string;
        email?: string;
        password?: string;
        githubId?: number;
        googleId?: string;
    }) => {
        return prisma.user.create({
            data: {
                name,
                email,
                password: password && hashSync(password, 10),
                githubId,
                googleId,
            },
        });
    };

    const updateUserPassword = ({
        id,
        password,
    }: {
        id: string;
        password: string;
    }) => {
        return prisma.user.update({
            where: {
                id,
            },
            data: {
                password: hashSync(password, 10),
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

    const findToken = ({
        userId,
        type,
    }: {
        userId: string;
        type: 'reset-password' | 'login';
    }) => {
        return prisma.token.findFirst({
            where: {
                userId,
                type,
            },
        });
    };

    const deleteToken = async ({
        userId,
        type,
    }: {
        userId: string;
        type: 'reset-password' | 'login';
    }) => {
        await prisma.token.deleteMany({
            where: {
                userId,
                type,
            },
        });
    };

    return {
        findUser,
        createUser,
        updateUserPassword,
        createToken,
        findToken,
        deleteToken,
    };
};
