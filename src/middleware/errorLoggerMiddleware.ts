import { ErrorRequestHandler } from 'express';

export const errorLoggerMiddleware: ErrorRequestHandler = (
    error,
    _,
    __,
    next
) => {
    console.log(error);

    next(error);
};
