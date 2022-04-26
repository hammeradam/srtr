import express from 'express';
import { hash, compare } from 'bcrypt';
import {
    validateLink,
    generateName,
    getLoggedInUser,
    sendHtml,
    getPaginationParams,
} from 'utils';
import prisma from 'prisma';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
    if (!(await validateLink(req, res))) {
        return;
    }

    const user = await getLoggedInUser(req);
    const name = req.body.name || (await generateName());
    const password =
        req.body.password && req.body.password.length
            ? await hash(req.body.password, 10)
            : undefined;

    const link = await prisma.link.create({
        data: {
            name,
            url: req.body.url,
            password,
            limit: req.body.limit || undefined,
            userId: user?.id,
            hasAdvancedAnalytics:
                req.body.hasAdvancedAnalytics === 'on' || false,
        },
    });

    res.json({
        name,
        url: link.url,
    });
});

// GET ALL
router.get('/', async (_req, res) =>
    res.json(
        await prisma.link.findMany({
            select: {
                url: true,
                name: true,
                hitCount: true,
            },
        })
    )
);

// PASSWORD
router.post('/password', async (req, res) => {
    const { password, name } = req.body;
    const link = await prisma.link.findFirst({ where: { name } });

    if (!link) {
        return res.status(404).end();
    }

    if (!password?.length || !name?.length) {
        return res.status(400).end();
    }

    if (!(await compare(password, link.password || ''))) {
        return res.status(403).end();
    }

    res.json({ url: link.url });
});

// OWN
router.get('/own', async (req, res) => {
    const user = await getLoggedInUser(req);

    if (!user) {
        return res.status(401).end();
    }

    return res.json({ links: user.links });
});

// GET
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const link = await prisma.link.findFirst({
        where: { name },
    });

    if (!link) {
        res.status(404);
        res.end();
        return;
    }

    const user = await getLoggedInUser(req);

    if (link.userId && (!user || link.userId !== user.id)) {
        return res.status(403).end();
    }

    res.json({
        link: {
            url: link.url,
            name: link.name,
            hitCount: link.hitCount,
        },
    });
});

router.get('/:name/analytics', async (req, res) => {
    const { name } = req.params;
    const paginationOptions = getPaginationParams(req);

    const analyticsCount = await prisma.analytics.count({
        where: {
            link: {
                name,
            },
        },
    });

    const analytics = await prisma.analytics.findMany({
        where: {
            link: {
                name,
            },
        },
        ...paginationOptions,
    });

    res.json({ data: analytics, count: analyticsCount });
});

export default router;
