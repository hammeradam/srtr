import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from 'prisma';

export const COOKIE_NAME = 'jid';

export const createAccessToken = (user: User) => {
    return jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '1h',
        }
    );
};

export const createRefreshToken = (user: User) => {
    return jwt.sign(
        { userId: user.id, tokenVersion: user.tokenVersion },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '7d',
        }
    );
};

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        secure: false,
    });
};

export const clearRefreshToken = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        secure: false,
    });
};
