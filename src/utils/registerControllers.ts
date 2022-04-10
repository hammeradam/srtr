import { Express } from 'express';
import authController from '../controllers/authController';
import linkController from '../controllers/linkController';
import rootController from '../controllers/rootController';

export const registerControllers = (app: Express) => {
    app.use('/api/auth', authController);
    app.use('/api/url', linkController);
    app.use('/', rootController);
};
