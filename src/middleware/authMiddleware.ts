import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware: RequestHandler = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    try {
        jwt.verify(token ?? '', process.env.TOKEN_SECRET!);
        next();
    } catch (error) {
        res.status(401).end();
    }
};
