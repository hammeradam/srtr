import { RequestHandler } from 'express';
import { cyan, green, magenta } from 'utils/color';
import { UAParser } from 'ua-parser-js';
export const loggerMiddleware: RequestHandler = (req, _, next) => {
    const ua = new UAParser(req.get('User-Agent')).getResult();

    console.log(ua);
    console.log(req.headers['x-forwarded-for']);

    console.log(
        `${magenta('REQUEST')} ${cyan(req.method.padEnd(4))} ${green(
            req.path
        )} ${cyan(req.ip)}`
    );

    next();
};
