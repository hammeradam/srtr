import { Schema, model, Types } from 'mongoose';
import { IUser } from './user';

interface IToken {
    token: string;
    createdAt: Date;
    user?: IUser;
}

const schema = new Schema<IToken>({
    token: String,
    createdAt: { type: Date, expires: 3600, default: Date.now },
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
});

export const Token = model<IToken>('Token', schema);
