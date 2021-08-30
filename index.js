import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToMongoDB } from './utils/connectToMongoDB.js';
import { registerControllers } from './utils/registerControllers.js';
import { registerMiddlewares } from './utils/registerMiddlewares.js';

connectToMongoDB();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
registerMiddlewares(app);
registerControllers(app, __dirname);

app.listen(process.env.PORT || 3000, () => {
    console.log('The application is listening on port 3000!');
});
