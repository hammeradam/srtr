import express, { Router } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma, { Prisma, Token, User } from 'prisma';
import {
    clearRefreshToken,
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
    COOKIE_NAME,
} from 'utils';

export interface DatabaseAdapter {
    findUser({
        id,
        email,
        githubId,
        googleId,
    }: {
        id?: string;
        email?: string;
        githubId?: number;
        googleId?: string;
    }): Prisma.Prisma__UserClient<User | null, null>;
    updateUserPassword({
        id,
        password,
    }: {
        id: string;
        password: string;
    }): Prisma.Prisma__UserClient<User, never>;
    createUser({
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
    }): Prisma.Prisma__UserClient<User, never>;
    findToken({
        userId,
        type,
    }: {
        userId: string;
        type: 'reset-password' | 'login';
    }): Prisma.Prisma__TokenClient<Token | null, null>;
    createToken({
        token,
        userId,
        type,
    }: {
        token: string;
        userId: string;
        type: 'reset-password' | 'login';
    }): Prisma.Prisma__TokenClient<Token, never>;
    deleteToken({
        userId,
        type,
    }: {
        userId: string;
        type: 'reset-password' | 'login';
    }): Prisma.PrismaPromise<Prisma.BatchPayload>;
}

interface AuthBuilderProps {
    adapter: DatabaseAdapter;
    providers?: Array<(adapter: DatabaseAdapter) => Router>;
}

export const authBuilder = ({ providers, adapter }: AuthBuilderProps) => {
    const router = express.Router();

    router.post('/refresh_token', async (req, res) => {
        try {
            const token = req.cookies[COOKIE_NAME];
            const payload = jwt.verify(
                token,
                process.env.TOKEN_SECRET
            ) as JwtPayload;

            const user = await prisma.user.findFirst({
                where: {
                    id: payload.userId,
                },
            });

            if (!user || user.tokenVersion !== payload.tokenVersion) {
                return res.status(401).send('missing_refresh_token');
            }

            sendRefreshToken(res, createRefreshToken(user));

            return res.json({
                token: createAccessToken(user),
                user: user.name || user.email,
            });
        } catch {
            return res.json({});
        }
    });

    router.post('/logout', (_req, res) => {
        clearRefreshToken(res);
        return res.end();
    });

    providers?.forEach((provider) => {
        router.use(provider(adapter));
    });

    return router;
};
