import { Schema, model, Types } from 'mongoose';
import { IUser } from './user';

interface ILink {
    url: string;
    name: string;
    password: string;
    hitCount: number;
    limit?: number;
    user?: IUser;
}

const schema = new Schema<ILink>({
    url: String,
    name: String,
    password: String,
    hitCount: Number,
    limit: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export const Link = model<ILink>('Link', schema);
