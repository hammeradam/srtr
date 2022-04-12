import express from 'express';
import { authMiddleware } from 'middleware';
import { Link } from 'models';
import { sendHtml } from 'utils';

const router = express.Router();

router.get('/l/:name', async (req, res) => {
    const link = await Link.findOne({ name: req.params.name });
    if (!link || (link.limit && link.limit <= link.hitCount)) {
        res.status(404);
        return sendHtml(res, '404', 404);
    }

    await link.updateOne({ hitCount: ++link.hitCount });

    if (link.password) {
        req.session.name = link.name;
        return sendHtml(res, 'password');
    }

    res.redirect(link.url);
});

router.get('/ping', authMiddleware, (_, res) => res.send('pong'));

router.get('*', (_, res) => sendHtml(res, 'index'));

export default router;
