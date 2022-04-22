import { Express, json, urlencoded, static as serveStatic } from 'express';
import session, { SessionOptions } from 'express-session';
import cookieParser from 'cookie-parser';
// import MongoStore from 'connect-mongo';
import { loggerMiddleware } from 'middleware';

export const registerMiddleware = (app: Express) => {
    const sessionConfig: SessionOptions = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    };

    // if (process.env.NODE_ENV === 'production') {
    //     sessionConfig.store = MongoStore.create({
    //         mongoUrl: `mongodb+srv://${
    //             process.env.DB_USER
    //         }:${encodeURIComponent(process.env.DB_PASSWORD)}@${
    //             process.env.DB_HOST
    //         }/${process.env.DB_NAME}`,
    //     });
    // }

    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(serveStatic('public'));
    app.use(cookieParser());
    app.use(loggerMiddleware);
    app.use(session(sessionConfig));
};
