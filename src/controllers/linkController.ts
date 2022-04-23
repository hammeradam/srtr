import express, { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { validateLink, generateName } from 'utils';
import prisma from 'prisma';

const router = express.Router();

const getUser = async (req: Request) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return null;
    }

    const payload = jwt.verify(
        token ?? '',
        process.env.TOKEN_SECRET
    ) as JwtPayload;

    const user = await prisma.user.findFirst({
        where: { id: payload.userId },
        include: {
            links: true,
        },
    });

    return user;
};

// CREATE
router.post('/', async (req, res) => {
    if (!(await validateLink(req, res))) {
        return;
    }

    const user = await getUser(req);
    const name = req.body.name || (await generateName());
    const password =
        req.body.password && req.body.password.length
            ? await hash(req.body.password, 10)
            : undefined;

    console.log({ password });
    const link = await prisma.link.create({
        data: {
            name,
            url: req.body.url,
            password,
            limit: req.body.limit || undefined,
            userId: user?.id,
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
    const user = await getUser(req);

    if (!user) {
        return res.status(401).end();
    }

    return res.json({ links: user.links });
});

// GET
router.get('/:name', async (req, res) => {
    const { name } = req.params;

    if (!name) {
        res.status(400);
        return res.json({
            error: 'name_required',
            field: 'name',
        });
    }

    const link = await prisma.link.findFirst({ where: { name } });

    if (!link) {
        res.status(404);
        res.end();
    }

    res.json({ link });
});

export default router;
