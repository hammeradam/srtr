import { Link } from '../models/link.js';

const validateUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
};

const validateName = (string) => /^[A-z0-9-._]+$/.test(string);

export const validateLink = async (req, res) => {
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