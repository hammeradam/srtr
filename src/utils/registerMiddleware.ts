import { Express, json, static as serveStatic } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { loggerMiddleware } from 'middleware';

export const registerMiddleware = (app: Express) => {
    app.use(compression());
    app.use(json());
    app.use(serveStatic('public'));
    app.use(cookieParser());
    app.use(loggerMiddleware);
};
