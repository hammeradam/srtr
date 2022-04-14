import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { User } from 'models';
import {
    clearRefreshToken,
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
    getGithubAccessToken,
    getGithubUserDetails,
    findOrCreateGithubUser,
    sendMail,
    COOKIE_NAME,
    buildMailHtml,
} from 'utils';
import { Token } from 'models/token';
import crypto from 'crypto';

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
    sendRefreshToken(res, createRefreshToken(user));

    res.json({
        token,
        user: user.name || user.email,
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('All input is required');
    }

    const user = await User.findOne({ email });

    if (!user || !(await compare(password, user.password!))) {
        return res.status(400).send('Invalid Credentials');
    }

    const token = createAccessToken(user);
    sendRefreshToken(res, createRefreshToken(user));

    res.json({
        token,
        user: user.name || user.email,
    });
});

router.get('/callback/github', async (req, res) => {
    const accessToken = await getGithubAccessToken(String(req.query.code));
    const userData = await getGithubUserDetails(accessToken);
    const user = await findOrCreateGithubUser(userData);

    sendRefreshToken(res, createRefreshToken(user));

    res.redirect('/');
});

router.post('/refresh_token', async (req, res) => {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
        return res.status(401).json({ error: 'missing_refresh_token' });
    }

    try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findOne({
            _id: (payload as JwtPayload).userId,
        });

        if (
            !user ||
            user.tokenVersion !== (payload as JwtPayload).tokenVersion
        ) {
            return res.status(401).json({ error: 'invalid_refresh_token' });
        }

        sendRefreshToken(res, createRefreshToken(user));

        return res.json({
            token: createAccessToken(user),
            user: user.name || user.email,
        });
    } catch (err) {
        console.error(err);
        res.status(400);
        return res.json({ error: 'invalid_refresh_token' });
    }
});

router.post('/logout', (_req, res) => {
    clearRefreshToken(res);
    return res.end();
});

router.post('/forgotten-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({
        email,
    });

    if (user?.email) {
        // TODO: send pw reset email
        await Token.deleteMany({ user: user._id });

        const token = crypto.randomBytes(32).toString('hex');

        console.log(
            `http://localhost:3000/reset-password?token=${token}&userId=${user._id}`
        );

        await sendMail(
            [user.email],
            'forgotten password',
            buildMailHtml(
                'forgotten password',
                'you can reset your password by clicking the link below',
                'reset password',
                `http://localhost:3000/reset-password?token=${token}&userId=${user._id}`
            )
        );

        const hashedToken = await hash(token, 10);
        new Token({
            token: hashedToken,
            user: user._id,
        }).save();
    }

    res.end();
});

router.post('/reset-password', async (req, res) => {
    const { token, userId, password, passwordConfirm } = req.body;
    const dbToken = await Token.findOne({
        user: userId,
    });

    if (password !== passwordConfirm) {
        return res
            .status(400)
            .send({ field: 'password-confirm', error: 'no-match' });
    }

    if (!dbToken || !compare(token, dbToken.token)) {
        return res.status(400).end();
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
        return res.status(400).end();
    }

    await user.updateOne({
        password: await hash(password, 10),
    });

    await Token.deleteMany({ user: userId });

    const newToken = createAccessToken(user);
    sendRefreshToken(res, createRefreshToken(user));

    res.json({
        token: newToken,
        user: user.name || user.email,
    });

    res.end();
});

export default router;
