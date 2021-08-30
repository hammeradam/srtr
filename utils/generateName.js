import crypto from 'crypto';
import { Link } from '../models/link.js';

export const generateName = async (length = 2) => {
    const name = crypto.randomBytes(length).toString('hex');
    if (await Link.exists({ name })) {
        return generateName();
    }

    return name;
};