import express from 'express';
import 'dotenv/config';
import { connectToMongoDB } from './utils/connectToMongoDB';
import { registerControllers } from './utils/registerControllers';
import { registerMiddlewares } from './utils/registerMiddlewares';

connectToMongoDB();

const app = express();

registerMiddlewares(app);
registerControllers(app);

app.listen(process.env.PORT || 3000, () => {
    console.log('The application is listening on port 3000!');
});
