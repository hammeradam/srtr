import { Schema, model, Types } from 'mongoose';

interface User {
    email: string;
    password: string;
    token: string;
    tokenVersion: number;
    links: Types.ObjectId[];
}

const schema = new Schema<User>({
    email: String,
    password: String,
    token: String,
    tokenVersion: Number,
    links: [{ type: Schema.Types.ObjectId, ref: 'Link' }],
});

export const User = model<User>('User', schema);
