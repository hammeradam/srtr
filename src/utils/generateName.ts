import crypto from 'crypto';
import { Link } from 'models';

export const generateName = async (length = 2): Promise<string> => {
    const name = crypto.randomBytes(length).toString('hex');
    if (await Link.exists({ name })) {
        return generateName();
    }

    return name;
};
