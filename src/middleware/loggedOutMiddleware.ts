import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const loggedOutMiddleware: RequestHandler = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    try {
        jwt.verify(token ?? '', process.env.TOKEN_SECRET);
        res.status(400).end();
    } catch (error) {
        next();
    }
};
