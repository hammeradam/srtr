import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { User, Token, TokenType } from 'models';
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
    getGoogleAccessToken,
    getGoogleUserDetails,
    findOrCreategoogleUser,
    findOrCreateByEmail,
    sendHtml,
} from 'utils';
import crypto from 'crypto';
import { loggedOutMiddleware } from 'middleware';

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

router.post('/login/email', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('All input is required');
    }

    const user = await findOrCreateByEmail(email);

    const token = crypto.randomBytes(32).toString('hex');
    const url = new URL(
        `/api/auth/callback/email?token=${token}&userId=${user._id}`,
        process.env.BASE_URL
    );

    await sendMail(
        [user.email!],
        'forgotten password',
        buildMailHtml(
            'login',
            'you can log in by clicking the link below',
            'login',
            url.href
        )
    );

    const hashedToken = await hash(token, 10);

    new Token({
        token: hashedToken,
        user: user._id,
        type: TokenType['login'],
    }).save();

    res.end();
});

router.get('/callback/email', loggedOutMiddleware, async (req, res) => {
    const { token, userId } = req.query;

    if (!token || !userId) {
        return sendHtml(res, '400', 400);
    }

    const dbToken = await Token.findOne({
        user: userId,
        type: TokenType['login'],
    });

    if (!dbToken || !compare(token.toString(), dbToken.token)) {
        return sendHtml(res, '400', 400);
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
        return sendHtml(res, '400', 400);
    }

    await Token.deleteMany({ user: userId, type: TokenType['login'] });

    sendRefreshToken(res, createRefreshToken(user));

    res.redirect('/');
});

router.get('/callback/github', async (req, res) => {
    const accessToken = await getGithubAccessToken(String(req.query.code));
    const userData = await getGithubUserDetails(accessToken);
    const user = await findOrCreateGithubUser(userData);

    sendRefreshToken(res, createRefreshToken(user));

    res.redirect('/');
});

router.get('/callback/google', async (req, res) => {
    const accessToken = await getGoogleAccessToken(String(req.query.code));
    const userData = await getGoogleUserDetails(accessToken);
    const user = await findOrCreategoogleUser(userData);

    if (user) {
        sendRefreshToken(res, createRefreshToken(user));
    }

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
        await Token.deleteMany({
            user: user._id,
            type: TokenType['reset-password'],
        });

        const token = crypto.randomBytes(32).toString('hex');
        const url = new URL(
            `/reset-password?token=${token}&userId=${user._id}`,
            process.env.BASE_URL
        );

        await sendMail(
            [user.email],
            'forgotten password',
            buildMailHtml(
                'forgotten password',
                'you can reset your password by clicking the link below',
                'reset password',
                url.href
            )
        );

        const hashedToken = await hash(token, 10);
        new Token({
            token: hashedToken,
            user: user._id,
            type: TokenType['reset-password'],
        }).save();
    }

    res.end();
});

router.post('/reset-password', async (req, res) => {
    const { token, userId, password, passwordConfirm } = req.body;
    const dbToken = await Token.findOne({
        user: userId,
        type: TokenType['reset-password'],
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

    await Token.deleteMany({ user: userId, type: TokenType['reset-password'] });

    const newToken = createAccessToken(user);
    sendRefreshToken(res, createRefreshToken(user));

    res.json({
        token: newToken,
        user: user.name || user.email,
    }).end();
});

export default router;
