import { ErrorRequestHandler } from 'express';

export const errorResponseMiddleware: ErrorRequestHandler = (
    error,
    _,
    res,
    __
) => {
    if (error.issues) {
        return res.status(400).json({
            message: 'Validation failed',
            issues: error.issues,
        });
    }
    const status = error.statusCode || 500;
    const message =
        (process.env.NODE_ENV !== 'production' && error.message) ||
        'Something went wrong';

    res.status(status).json({
        status,
        message,
    });
};
