import crypto from 'node:crypto';
import express from 'express';
import prisma from 'prisma';
import { hash, compare } from 'bcrypt';
import {
    buildMailHtml,
    createRefreshToken,
    sendMail,
    sendRefreshToken,
} from 'utils';

const findOrCreateByEmail = async (email: string) => {
    const user = await prisma.user.findFirst({ where: { email } });

    if (user) {
        return user;
    }

    const newUser = await prisma.user.create({
        data: {
            email,
        },
    });

    return newUser;
};

export const magicLinkProvider = () => {
    const router = express.Router();

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

    router.get('/callback/email', async (req, res) => {
        const { token, userId } = req.query;

        if (!token || !userId || typeof userId !== 'string') {
            return res.redirect('/error?code=400');
        }

        const dbToken = await prisma.token.findFirst({
            where: {
                userId: userId,
                type: 'login',
            },
        });

        if (!dbToken || !compare(token.toString(), dbToken.content)) {
            return res.redirect('/error?code=400');
        }

        const user = await prisma.user.findFirst({ where: { id: userId } });

        if (!user) {
            return res.redirect('/error?code=400');
        }

        await prisma.token.deleteMany({ where: { userId, type: 'login' } });

        sendRefreshToken(res, createRefreshToken(user));

        res.redirect('/');
    });

    return router;
};
