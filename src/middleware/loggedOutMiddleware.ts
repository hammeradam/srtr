import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const loggedOutMiddleware: RequestHandler = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    try {
        const result = jwt.verify(token ?? '', process.env.TOKEN_SECRET);
        console.log({ result });
        res.status(400).end();
    } catch (error) {
        next();
    }
};
