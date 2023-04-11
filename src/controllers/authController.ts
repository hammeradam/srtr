import express, { Router } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma, { Token, User } from 'prisma';
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
    }: Partial<
        Pick<User, 'id' | 'email' | 'githubId' | 'googleId'>
    >): Promise<User | null>;
    updateUserPassword({
        id,
        password,
    }: Pick<User, 'id' | 'password'>): Promise<User | null>;
    createUser({
        email,
        password,
        name,
        githubId,
        googleId,
    }: Partial<
        Pick<
            User,
            'id' | 'email' | 'password' | 'name' | 'githubId' | 'googleId'
        >
    >): Promise<User>;
    findToken({
        userId,
        type,
    }: {
        userId: string;
        type: 'reset-password' | 'login';
    }): Promise<Token | null>;
    createToken({
        token,
        userId,
        type,
    }: {
        token: string;
        userId: string;
        type: 'reset-password' | 'login';
    }): Promise<Token>;
    deleteToken({
        userId,
        type,
    }: {
        userId: string;
        type: 'reset-password' | 'login';
    }): Promise<void>;
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
