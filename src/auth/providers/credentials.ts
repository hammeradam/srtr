import crypto from 'node:crypto';
import express from 'express';
import prisma from 'prisma';
import { hash, compare } from 'bcrypt';
import {
    buildMailHtml,
    createAccessToken,
    createRefreshToken,
    sendMail,
    sendRefreshToken,
} from 'utils';

export const credentialsProvider = () => {
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

    return router;
};
