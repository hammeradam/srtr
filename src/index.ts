import express from 'express';
import 'dotenv/config';
import {
    registerControllers,
    registerErrorHandling,
    registerMiddleware,
} from 'utils';

const app = express();
app.set('trust proxy', true);

registerMiddleware(app);
registerControllers(app);
registerErrorHandling(app);

app.listen(process.env.PORT || 3000, () => {
    console.info('The application is listening on port 3000!');
});
