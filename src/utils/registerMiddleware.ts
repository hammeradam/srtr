import { Express, json, urlencoded, static as serveStatic } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { loggerMiddleware } from 'middleware';

export const registerMiddleware = (app: Express) => {
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(serveStatic('public'));
    app.use(cookieParser());
    app.use(loggerMiddleware);
    app.use(
        session({
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: true,
        })
    );
};
