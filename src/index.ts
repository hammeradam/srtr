import express from 'express';
import 'dotenv/config';
import {
    connectToMongoDB,
    registerControllers,
    registerMiddleware,
    // selfPing,
} from 'utils';

connectToMongoDB();

const app = express();

registerMiddleware(app);
registerControllers(app);

app.listen(process.env.PORT || 3000, () => {
    console.info('The application is listening on port 3000!');
});

// selfPing({});
