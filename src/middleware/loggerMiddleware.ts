import { RequestHandler } from 'express';
import { cyan, green, magenta } from 'utils/color';

export const loggerMiddleware: RequestHandler = (req, _, next) => {
    console.log(
        `${magenta('REQUEST')} ${cyan(req.method.padEnd(4))} ${green(req.path)}`
    );
    next();
};
