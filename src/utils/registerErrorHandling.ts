import { Express } from 'express';
import { errorResponseMiddleware, errorLoggerMiddleware } from 'middleware';

export const registerErrorHandling = (app: Express) => {
    app.use(errorLoggerMiddleware);
    app.use(errorResponseMiddleware);
};
