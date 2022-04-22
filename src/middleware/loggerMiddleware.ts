import { RequestHandler } from 'express';
import { cyan, green } from 'utils/color';

export const loggerMiddleware: RequestHandler = (req, _, next) => {
    console.log(`${cyan(req.method.padEnd(4))} ${green(req.path)}`);
    next();
};
