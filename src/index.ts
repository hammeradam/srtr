import express from 'express';
import 'dotenv/config';
import { connectToMongoDB, registerControllers, registerMiddlewares } from 'utils';

connectToMongoDB();

const app = express();

registerMiddlewares(app);
registerControllers(app);

app.listen(process.env.PORT || 3000, () => {
    console.info('The application is listening on port 3000!');
});

