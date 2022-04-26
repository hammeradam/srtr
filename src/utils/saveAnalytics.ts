import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import prisma, { Link } from 'prisma';

const getIp = (req: Request) =>
    (Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for']) || req.ip;

export const saveAnalytics = async (req: Request, link: Link) => {
    const userAgent = req.get('User-Agent');
    const ua = new UAParser(userAgent).getResult();

    await prisma.analytics.create({
        data: {
            userAgent: userAgent,
            ip: getIp(req),
            os: `${ua.os.name} ${ua.os.version}`,
            browser: `${ua.browser.name} ${ua.browser.version}`,
            device: `${ua.device.vendor || ''} ${ua.device.model || ''} ${
                ua.device.type || ''
            }`.trim(),
            linkId: link.id,
        },
    });
};
