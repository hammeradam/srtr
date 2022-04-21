import { Schema, model, Types } from 'mongoose';
import { IUser } from './user';

export enum TokenType {
    'reset-password',
    'login',
}

interface IToken {
    token: string;
    type: TokenType;
    createdAt: Date;
    user?: IUser;
}

const schema = new Schema<IToken>({
    token: String,
    type: Number,
    createdAt: { type: Date, expires: 3600, default: Date.now },
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
});

export const Token = model<IToken>('Token', schema);
