import mongoose from 'mongoose';

export const Link = mongoose.model('Link', new mongoose.Schema({
    url: String,
    name: String,
    password: String,
    hitCount: Number,
    limit: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}));