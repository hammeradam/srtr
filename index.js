import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const { DB_USER, DB_NAME, DB_PASSWORD } = process.env;

mongoose.connect(
    `mongodb+srv://${DB_USER}:${encodeURIComponent(
        DB_PASSWORD
    )}@shortr.xwnwx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const Link = mongoose.model('Link', {
    url: String,
    name: String,
    hitCount: Number
});

const app = express();
app.use(express.json());

// app.get('/', async (req, res) => {
//     res.send('Well done!');
//     await Link.create({ name: 'asd2', url: 'http://google.com', hitCount: 0 });
//     const exists = await Link.exists({ name: 'asd' });
//     const link = await Link.findOne({ name: 'asd' });
//     link.name = 'asd2'
//     link.save();
//     console.log(link);
// });

app.post('/url', async (req, res) => {
    if (await Link.exists({ name: req.body.name })) {
        res.status(400);
        res.json({
            error: 'name already taken'
        });
    }

    await Link.create({ name: req.body.name, url: req.body.url, hitCount: 0 });
    res.end();
});

app.get('/:name', async (req, res) => {
    const link = await Link.findOne({ name: req.params.name });
    if (!link) {
        req.status(404);
        res.end();
    }
    await link.update({ hitCount: ++link.hitCount });
    res.redirect(link.url);
    res.end();
});

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});
