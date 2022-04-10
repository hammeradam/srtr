import path from 'path';
import express from 'express';
import { Link } from '../models/link';

const router = express.Router();

router.get('/:name', async (req, res) => {
    const link = await Link.findOne({ name: req.params.name });
    if (!link) {
        res.status(404);
        return res.sendFile(path.join(__dirname, '../pages/404.html'));
    }

    if (link.limit && link.limit <= link.hitCount) {
        res.status(404);
        return res.sendFile(path.join(__dirname, '../pages/404.html'));
    }

    await link.updateOne({ hitCount: ++link.hitCount });

    if (link.password) {
        // @ts-ignore
        req.session.name = link.name;
        return res.sendFile(path.join(__dirname, '../pages/password.html'));
    }

    res.redirect(link.url);
});

export default router;
