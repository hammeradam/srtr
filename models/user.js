import mongoose from 'mongoose';

export const User = mongoose.model(
    'User',
    new mongoose.Schema({
        email: String,
        password: String,
        token: String,
        tokenVersion: Number,
        links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }],
    })
);
