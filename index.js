import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

import dotenv from 'dotenv';
dotenv.config();

const { DB_USER, DB_NAME, DB_PASSWORD, PORT } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

mongoose.connect(
    `mongodb+srv://${DB_USER}:${encodeURIComponent(
        DB_PASSWORD
    )}@shortr.xwnwx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const Link = mongoose.model('Link', {
    url: String,
    name: String,
    hitCount: Number,
});

const generareName = async (length = 2) => {
    const name = crypto.randomBytes(length).toString('hex');
    if (await Link.exists({ name })) {
        return generareName();
    }

    return name;
};

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

const validate = async (req, res) => {
    if (!req.body.url) {
        res.status(400);
        res.json({
            error: 'url_required',
            field: 'url',
        });
    }

    if (!validateUrl(req.body.url)) {
        res.status(400);
        res.json({
            error: 'url_invalid',
            field: 'url',
        });
    }

    if (req.body.name && (await Link.exists({ name: req.body.name }))) {
        res.status(400);
        res.json({
            error: 'name_taken',
            field: 'name',
        });
    }

    if (req.body.name && !validateName(req.body.name)) {
        res.status(400);
        res.json({
            error: 'name_invalid',
            field: 'name',
        });
    }
};

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/links', (_req, res) => {
    res.sendFile(path.join(__dirname + '/links.html'));
});

app.post('/api/url', async (req, res) => {
    await validate(req, res);

    const name = req.body.name || (await generareName());

    await Link.create({ name, url: req.body.url, hitCount: 0 });
    res.json({
        name,
        url: req.body.url,
    });
    res.end();
});

app.get('/api/url', async (_req, res) =>
    res.json(
        (await Link.find()).map((link) => ({
            url: link.url,
            name: link.name,
            hitCount: link.hitCount,
        }))
    )
);

app.get('/api/url/:name', async (req, res) => {
    if (!req.params.name) {
        res.status(400);
        res.json({
            error: 'name_required',
            field: 'name',
        });
    }

    const link = await Link.findOne({ name: req.params.name });

    if (!link) {
        res.status(404);
        res.end();
    }

    res.json({ link });
    res.end();
});

app.get('/:name', async (req, res) => {
    const link = await Link.findOne({ name: req.params.name });
    if (!link) {
        res.status(404);
        res.sendFile(path.join(__dirname + '/404.html'));
    }
    await link.update({ hitCount: ++link.hitCount });
    res.redirect(link.url);
    res.end();
});

app.listen(PORT || 3000, () => {
    console.log('The application is listening on port 3000!');
});
