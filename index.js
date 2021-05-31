import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
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

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/links', (req, res) => {
    res.sendFile(path.join(__dirname+'/links.html'))
})

app.post('/api/url', async (req, res) => {
    if (await Link.exists({ name: req.body.name })) {
        res.status(400);
        res.json({
            error: 'name already taken',
        });
    }

    await Link.create({ name: req.body.name, url: req.body.url, hitCount: 0 });
    res.end();
});

app.get('/api/url', async (req, res) =>
    res.json(
        (await Link.find()).map((link) => ({
            url: link.url,
            name: link.name,
            hitCount: link.hitCount,
        }))
    )
);

app.get('/:name', async (req, res) => {
    const link = await Link.findOne({ name: req.params.name });
    if (!link) {
        res.status(404);
        res.sendFile(path.join(__dirname+'/404.html'))
    }
    await link.update({ hitCount: ++link.hitCount });
    res.redirect(link.url);
    res.end();
});

app.listen(PORT || 3000, () => {
    console.log('The application is listening on port 3000!');
});
