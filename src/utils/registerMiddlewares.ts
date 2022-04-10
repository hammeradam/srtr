import { Express, json, urlencoded, static as serveStatic } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import url from 'url';

export const registerMiddlewares = (app: Express) => {
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(serveStatic('public'));
    app.use(cookieParser());
    app.use(
        session({
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: true,
        })
    );
};
