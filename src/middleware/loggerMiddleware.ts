import { RequestHandler } from 'express';

export const loggerMiddleware: RequestHandler = (req, _, next) => {
    console.log(
        `\x1b[36m${req.method.padEnd(4, ' ')} \x1b[32m${req.path}\x1b[0m`
    );
    next();
};
