import { Request, Response } from 'express';
import { Link } from 'models';

const validateUrl = (string: string) => {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

const validateName = (name: string) => /^[A-z0-9-._]+$/.test(name);

export const validateLink = async (req: Request, res: Response) => {
    const { url, name } = req.body;

    if (!url) {
        res.status(400);
        return res.json({
            error: 'url_required',
            field: 'url',
        });
    }

    if (!validateUrl(url)) {
        res.status(400);
        return res.json({
            error: 'url_invalid',
            field: 'url',
        });
    }

    if (name && (await Link.exists({ name }))) {
        res.status(400);
        return res.json({
            error: 'name_taken',
            field: 'name',
        });
    }

    if (name && !validateName(name)) {
        res.status(400);
        return res.json({
            error: 'name_invalid',
            field: 'name',
        });
    }

    return true;
};