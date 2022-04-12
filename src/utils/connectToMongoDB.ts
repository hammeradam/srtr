import mongoose from 'mongoose';
const { DB_USER, DB_NAME, DB_PASSWORD } = process.env;

export const connectToMongoDB = () => {
    mongoose.connect(
        `mongodb+srv://${DB_USER}:${encodeURIComponent(
            DB_PASSWORD
        )}@shortr.xwnwx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );
};
