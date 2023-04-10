import express, { Router } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from 'prisma';
import {
    clearRefreshToken,
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
    COOKIE_NAME,
} from 'utils';
import { ApplicationError } from 'errors';

interface AuthBuilderProps {
    providers?: Router[];
}

export const authBuilder = ({ providers }: AuthBuilderProps) => {
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
                throw new ApplicationError('missing_refresh_token', 401);
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
        router.use(provider);
    });

    return router;
};
