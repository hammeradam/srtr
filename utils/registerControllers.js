import authController from '../controllers/authController.js';
import linkController from '../controllers/linkController.js';
import rootController from '../controllers/rootController.js';

export const registerControllers = (app) => {
    app.use('/api/auth', authController);
    app.use('/api/url', linkController);
    app.use('/', rootController);
};
