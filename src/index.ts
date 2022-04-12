import express from 'express';
import 'dotenv/config';
import {
    connectToMongoDB,
    registerControllers,
    registerMiddleware,
} from 'utils';
import { authMiddleware } from 'middleware';

connectToMongoDB();

const app = express();

app.get('/ping', authMiddleware, (_, res) => res.send('pong'));
registerMiddleware(app);
registerControllers(app);

app.listen(process.env.PORT || 3000, () => {
    console.info('The application is listening on port 3000!');
});
