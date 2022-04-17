import { Schema, model, Types } from 'mongoose';

export interface IUser {
    email?: string;
    githubId?: number;
    googleId?: number;
    name?: string;
    password?: string;
    token?: string;
    tokenVersion?: number;
    links: Types.ObjectId[];
}

const schema = new Schema<IUser>({
    email: String,
    githubId: Number,
    googleId: Number,
    name: String,
    password: String,
    token: String,
    tokenVersion: Number,
    links: [{ type: Schema.Types.ObjectId, ref: 'Link' }],
});

export const User = model<IUser>('User', schema);
