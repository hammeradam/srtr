import express from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
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
import prisma from 'prisma';
import { ApplicationError } from 'errors';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('All input is required');
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (existingUser) {
        return res.status(409).send('User Already Exist. Please Login');
    }

    const user = await prisma.user.create({
        data: {
            email,
            password: await hash(password, 10),
        },
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

    const user = await prisma.user.findFirst({ where: { email } });

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
        `/api/auth/callback/email?token=${token}&userId=${user.id}`,
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

    await prisma.token.create({
        data: {
            content: hashedToken,
            userId: user.id,
            type: 'login',
        },
    });

    res.end();
});

router.get('/callback/email', loggedOutMiddleware, async (req, res) => {
    const { token, userId } = req.query;

    if (!token || !userId || typeof userId !== 'string') {
        return sendHtml(res, '400', 400);
    }

    const dbToken = await prisma.token.findFirst({
        where: {
            userId: userId,
            type: 'login',
        },
    });

    if (!dbToken || !compare(token.toString(), dbToken.content)) {
        return sendHtml(res, '400', 400);
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
        return sendHtml(res, '400', 400);
    }

    await prisma.token.deleteMany({ where: { userId, type: 'login' } });

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
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await prisma.user.findFirst({
        where: {
            id: (payload as JwtPayload).userId,
        },
    });

    if (!user || user.tokenVersion !== (payload as JwtPayload).tokenVersion) {
        throw new ApplicationError('missing_refresh_token', 401);
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.json({
        token: createAccessToken(user),
        user: user.name || user.email,
    });
});

router.post('/logout', (_req, res) => {
    clearRefreshToken(res);
    return res.end();
});

router.post('/forgotten-password', async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (user?.email) {
        await prisma.token.deleteMany({
            where: {
                userId: user.id,
                type: 'reset-password',
            },
        });

        const token = crypto.randomBytes(32).toString('hex');
        const url = new URL(
            `/reset-password?token=${token}&userId=${user.id}`,
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

        await prisma.token.create({
            data: {
                content: await hash(token, 10),
                userId: user.id,
                type: 'reset-password',
            },
        });
    }

    res.end();
});

router.post('/reset-password', async (req, res) => {
    const { token, userId, password, passwordConfirm } = req.body;
    const dbToken = await prisma.token.findFirst({
        where: {
            userId,
            type: 'reset-password',
        },
    });

    if (password !== passwordConfirm) {
        return res
            .status(400)
            .send({ field: 'password-confirm', error: 'no-match' });
    }

    if (!dbToken || !compare(token, dbToken.content)) {
        return res.status(400).end();
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
        return res.status(400).end();
    }

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: await hash(password, 10),
        },
    });

    await prisma.token.deleteMany({
        where: { userId, type: 'reset-password' },
    });

    const newToken = createAccessToken(user);
    sendRefreshToken(res, createRefreshToken(user));

    res.json({
        token: newToken,
        user: user.name || user.email,
    }).end();
});

export default router;
