import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'jid';

export const createAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.TOKEN_SECRET!,
        {
            expiresIn: '15m',
        }
    );
};

export const createRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id, tokenVersion: user.tokenVersion },
        process.env.TOKEN_SECRET!,
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
