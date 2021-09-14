import path from 'path';
import express from 'express';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { hash, compare } from 'bcrypt';
import { Link } from '../models/link.js';
import { User } from '../models/user.js';
import { validateLink } from '../utils/validateLink.js';
import { generateName } from '../utils/generateName.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
    const isValid = await validateLink(req, res);

    let user = null;
    const token = req.headers['authorization']?.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        user = await User.findOne({ _id: payload.userId });
    } catch (error) {
        console.log(error);
    }

    if (isValid === true) {
        const name = req.body.name || (await generateName());

        let password = null;

        if (req.body.password && req.body.password.length) {
            password = await hash(req.body.password, 10);
        }

        const link = await Link.create({
            name,
            url: req.body.url,
            hitCount: 0,
            password,
            limit: req.body.limit,
            user: user ? user._id : null,
        });

        if (user) {
            user.links.push(link._id);
            await user.save();
        }

        res.json({
            name,
            url: req.body.url,
        });
    }
});

// GET ALL
router.get('/', async (_req, res) =>
    res.json(
        (await Link.find()).map((link) => ({
            url: link.url,
            name: link.name,
            hitCount: link.hitCount,
        }))
    )
);

// PASSWORD
router.post('/password', async (req, res) => {
    const { password } = req.body;
    const { name } = req.session;

    if (!password?.length || !name?.length) {
        return res.sendFile(path.join(__dirname, '../pages/400.html'));
    }

    const link = await Link.findOne({ name });
    req.session.destroy();

    if (!(await compare(password, link.password))) {
        return res.sendFile(path.join(__dirname, '../pages/400.html'));
    }

    res.redirect(link.url);
});

// OWN
router.get('/own', async (req, res) => {
    let user = null;
    const token = req.headers['authorization']?.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        user = await User.findOne({ _id: payload.userId }).populate('links').select('links');
    } catch (error) {
        console.log(error);
    }

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
        res.json({
            error: 'name_required',
            field: 'name',
        });
    }

    const link = await Link.findOne({ name });

    if (!link) {
        res.status(404);
        res.end();
    }

    res.json({ link });
});

export default router;
