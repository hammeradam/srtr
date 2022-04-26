import { Request, Response } from 'express';
import prisma from 'prisma';

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
    const { url, name, hasAdvancedAnalytics } = req.body;

    if (!url) {
        res.status(400).json({
            error: 'url_required',
            field: 'url',
        });

        return false;
    }

    if (!validateUrl(url)) {
        res.status(400).json({
            error: 'url_invalid',
            field: 'url',
        });

        return false;
    }

    if (name && (await prisma.link.findFirst({ where: { name } }))) {
        res.status(400).json({
            error: 'name_taken',
            field: 'name',
        });

        return false;
    }

    if (name && !validateName(name)) {
        res.status(400).json({
            error: 'name_invalid',
            field: 'name',
        });

        return false;
    }

    return true;
};
