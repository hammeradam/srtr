import { Express, json, urlencoded, static as serveStatic } from 'express';
import session, { SessionOptions } from 'express-session';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { loggerMiddleware } from 'middleware';

export const registerMiddleware = (app: Express) => {
    const sessionConfig: SessionOptions = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    };

    app.use(compression());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(serveStatic('public'));
    app.use(cookieParser());
    app.use(loggerMiddleware);
    app.use(session(sessionConfig));
};
