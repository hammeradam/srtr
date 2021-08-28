import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import session from 'express-session';
import dotenv from 'dotenv';
import { hash, genSalt, compare } from 'bcrypt';

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
    password: String,
    hitCount: Number,
    limit: Number,
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
        return res.json({
            error: 'url_required',
            field: 'url',
        });
    }

    if (!validateUrl(req.body.url)) {
        res.status(400);
        return res.json({
            error: 'url_invalid',
            field: 'url',
        });
    }

    if (req.body.name && (await Link.exists({ name: req.body.name }))) {
        res.status(400);
        return res.json({
            error: 'name_taken',
            field: 'name',
        });
    }

    if (req.body.name && !validateName(req.body.name)) {
        res.status(400);
        return res.json({
            error: 'name_invalid',
            field: 'name',
        });
    }

    return true;
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
    session({
        secret: 'naslfnkadfkamfkamf',
        resave: false,
        saveUninitialized: true,
    })
);

app.get('/links', (_req, res) => {
    res.sendFile(path.join(__dirname + '/links.html'));
});

app.post('/api/url', async (req, res) => {
    const isValid = await validate(req, res);

    if (isValid === true) {
        const name = req.body.name || (await generareName());

        let password = null;
        console.log(req.body);
        if (req.body.password && req.body.password.length) {
            password = await hash(req.body.password, await genSalt(10));
        }

        await Link.create({
            name,
            url: req.body.url,
            hitCount: 0,
            password,
            limit: req.body.limit,
        });
        res.json({
            name,
            url: req.body.url,
        });
    }
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

app.post('/api/url/password', async (req, res) => {
    if (!req.body.password.length || !req.session.name.length) {
        return res.sendFile(path.join(__dirname + '/pages/400.html'));
    }
    const link = await Link.findOne({ name: req.session.name });
    req.session.destroy();

    if (!(await compare(req.body.password, link.password))) {
        return res.sendFile(path.join(__dirname + '/pages/400.html'));
    }

    res.redirect(link.url);
});

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
});

app.get('/:name', async (req, res) => {
    const link = await Link.findOne({ name: req.params.name });
    if (!link) {
        res.status(404);
        return res.sendFile(path.join(__dirname + '/pages/404.html'));
    }

    if (link.limit && link.limit <= link.hitCount) {
        res.status(404);
        return res.sendFile(path.join(__dirname + '/pages/404.html'));
    }

    await link.updateOne({ hitCount: ++link.hitCount });

    if (link.password) {
        req.session.name = link.name;
        return res.sendFile(path.join(__dirname + '/pages/password.html'));
    }

    res.redirect(link.url);
});

app.listen(PORT || 3000, () => {
    console.log('The application is listening on port 3000!');
});
