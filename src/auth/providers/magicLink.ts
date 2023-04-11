import crypto from 'node:crypto';
import express from 'express';
import { compare } from 'bcrypt';
import {
    buildMailHtml,
    createRefreshToken,
    sendMail,
    sendRefreshToken,
} from 'utils';
import { DatabaseAdapter } from 'controllers/authController';

interface MagicLinkProviderOptions {
    baseUrl: string;
}

export const magicLinkProvider =
    ({ baseUrl }: MagicLinkProviderOptions) =>
    (adapter: DatabaseAdapter) => {
        const router = express.Router();

        const findOrCreateByEmail = async (email: string) => {
            const user = await adapter.findUser({ email });

            if (user) {
                return user;
            }

            const newUser = await adapter.createUser({
                email,
            });

            return newUser;
        };

        router.post('/login/email', async (req, res) => {
            const { email } = req.body;

            if (!email) {
                return res.status(400).send('All input is required');
            }

            const user = await findOrCreateByEmail(email);

            const token = crypto.randomBytes(32).toString('hex');
            const url = new URL(
                `/api/auth/callback/email?token=${token}&userId=${user.id}`,
                baseUrl
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

            await adapter.createToken({
                token,
                userId: user.id,
                type: 'login',
            });

            res.end();
        });

        router.get('/callback/email', async (req, res) => {
            const { token, userId } = req.query;

            if (!token || !userId || typeof userId !== 'string') {
                return res.redirect('/error?code=400');
            }

            const dbToken = await adapter.findToken({
                userId: userId,
                type: 'login',
            });

            if (!dbToken || !compare(token.toString(), dbToken.content)) {
                return res.redirect('/error?code=400');
            }

            const user = await adapter.findUser({ id: userId });

            if (!user) {
                return res.redirect('/error?code=400');
            }

            await adapter.deleteToken({ userId, type: 'login' });

            sendRefreshToken(res, createRefreshToken(user));

            res.redirect('/');
        });

        return router;
    };
