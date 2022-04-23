import express from 'express';
import prisma from 'prisma';
import { sendHtml } from 'utils';

const router = express.Router();

router.get('/l/:name', async (req, res) => {
    const link = await prisma.link.findFirst({
        where: { name: req.params.name },
    });

    if (!link || (link.limit && link.limit <= link.hitCount)) {
        return res.status(404).redirect('/error?code=404');
    }

    await prisma.link.updateMany({
        where: { name: req.params.name },
        data: {
            hitCount: {
                increment: 1,
            },
        },
    });

    if (link.password) {
        return res.redirect(`/password?name=${link.name}`);
    }

    res.redirect(link.url);
});

router.get('/ping', (_, res) => res.send('pong'));

router.get('/(.*)', (_, res) => sendHtml(res, 'index'));

export default router;
