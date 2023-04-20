import express, { Router } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthMethod, Token, User } from 'prisma';
import {
    clearRefreshToken,
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
    COOKIE_NAME,
    getLoggedInUser,
} from 'utils';

export interface DatabaseAdapter {
    findUser(params: Partial<Pick<User, 'id' | 'email'>>): Promise<User | null>;
    createUser(
        params: Partial<Pick<User, 'id' | 'email' | 'name' | 'verified'>>
    ): Promise<User>;
    findAuthMethod(params: Pick<AuthMethod, 'type' | 'value'>): Promise<
        | (AuthMethod & {
              user: User;
          })
        | null
    >;
    updateUser(
        id: string,
        data: Partial<
            Pick<User, 'name' | 'email' | 'tokenVersion' | 'verified'>
        >
    ): Promise<User>;
    createAuthMethod: (
        params: Pick<AuthMethod, 'type' | 'value' | 'userId' | 'secret'>
    ) => Promise<AuthMethod | null>;
    updateAuthMethod: (
        where: Pick<AuthMethod, 'type' | 'userId'>,
        data: Partial<Pick<AuthMethod, 'value' | 'secret'>>
    ) => Promise<AuthMethod | null>;
    findToken({
        userId,
        type,
    }: {
        userId: string;
        type: 'reset-password' | 'login' | 'verify';
    }): Promise<Token | null>;
    createToken({
        token,
        userId,
        type,
    }: {
        token: string;
        userId: string;
        type: 'reset-password' | 'login' | 'verify';
    }): Promise<Token>;
    deleteToken({
        userId,
        type,
    }: {
        userId: string;
        type: 'reset-password' | 'login' | 'verify';
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

            if (!token) {
                return res.status(401).send('missing_refresh_token');
            }

            const payload = jwt.verify(
                token,
                process.env.TOKEN_SECRET
            ) as JwtPayload;

            const user = await adapter.findUser({
                id: payload.userId,
            });

            if (!user || user.tokenVersion !== payload.tokenVersion) {
                return res.status(401).send('invalid_refresh_token');
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

    router.post('/logout', async (req, res) => {
        clearRefreshToken(res);
        const user = await getLoggedInUser(req);

        if (user && req.query.all === 'true') {
            await adapter.updateUser(user.id, {
                tokenVersion: user.tokenVersion + 1,
            });
        }

        return res.end();
    });

    providers?.forEach((provider) => {
        router.use(provider(adapter));
    });

    return router;
};
