import express from 'express';
import 'dotenv/config';
import { connectToMongoDB } from './utils/connectToMongoDB.js';
import { registerControllers } from './utils/registerControllers.js';
import { registerMiddlewares } from './utils/registerMiddlewares.js';

connectToMongoDB();

const app = express();
registerMiddlewares(app);
registerControllers(app);

app.listen(process.env.PORT || 3000, () => {
    console.log('The application is listening on port 3000!');
});
