import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { User } from '../models/user';
import {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} from '../utils/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('All input is required');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).send('User Already Exist. Please Login');
    }

    const encryptedPassword = await hash(password, 10);

    const user = await User.create({
        email,
        password: encryptedPassword,
        tokenVersion: 0,
    });

    const token = createAccessToken(user);
    user.token = token;
    sendRefreshToken(res, createRefreshToken(user));

    res.redirect('/');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('All input is required');
    }

    const user = await User.findOne({ email });

    if (!user || !(await compare(password, user.password))) {
        return res.status(400).send('Invalid Credentials');
    }

    const token = createAccessToken(user);
    user.token = token;
    sendRefreshToken(res, createRefreshToken(user));

    res.redirect('/');
});

router.post('/refresh_token', async (req, res) => {
    const token = req.cookies.jid;

    if (!token) {
        res.status(400);
        return res.json({ error: 'missing_refresh_token' });
    }

    try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET!);
        const user = await User.findOne({ _id: (payload as JwtPayload).userId });

        if (!user) {
            res.status(400);
            return res.json({ error: 'invalid_refresh_token' });
        }

        if (user.tokenVersion !== (payload as JwtPayload).tokenVersion) {
            res.status(400);
            return res.json({ error: 'invalid_refresh_token' });
        }

        sendRefreshToken(res, createRefreshToken(user));

        return res.json({ accessToken: createAccessToken(user) });
    } catch (err) {
        console.error(err);
        res.status(400);
        return res.json({ error: 'invalid_refresh_token' });
    }
});

router.post('/logout', (_req, res) => {
    sendRefreshToken(res, '');
    return res.end();
});

export default router;
