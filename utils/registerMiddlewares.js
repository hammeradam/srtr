import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

export const registerMiddlewares = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
        })
    );
};
