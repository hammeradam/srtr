import crypto from 'node:crypto';
import express from 'express';
import { hash, compare } from 'bcrypt';
import {
    buildMailHtml,
    createAccessToken,
    createRefreshToken,
    sendMail,
    sendRefreshToken,
} from 'utils';
import { DatabaseAdapter } from 'controllers/authController';
import z from 'zod';
interface CredentialsProviderOptions {
    baseUrl: string;
}

const resetPasswordSchema = z
    .object({
        token: z.string(),
        userId: z.string(),
        password: z.string().min(5, 'Password must be at least 5 characters'),
        passwordConfirm: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.passwordConfirm) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Passwords do not match',
            });
        }
    });

export const credentialsProvider =
    ({ baseUrl }: CredentialsProviderOptions) =>
    (adapter: DatabaseAdapter) => {
        const router = express.Router();

        router.post('/register', async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).send('All input is required');
            }

            const existingUser = await adapter.findUser({ email });

            if (existingUser) {
                return res.status(409).send('User Already Exist. Please Login');
            }

            let user = await adapter.findUser({ email });

            if (!user) {
                user = await adapter.createUser({
                    email,
                    verified: false,
                });
            }

            await adapter.createAuthMethod({
                type: 'credentials',
                value: email,
                userId: user.id,
                secret: await hash(password, 10),
            });

            const token = crypto.randomBytes(32).toString('hex');
            const url = new URL(
                `api/auth/verify?token=${token}&userId=${user.id}`,
                baseUrl
            );

            await adapter.createToken({
                token: await hash(token, 10),
                userId: user.id,
                type: 'verify',
            });

            sendMail(
                [email],
                'welcome',
                buildMailHtml('welcome', 'welcome', 'verify', url.href)
            );

            res.status(201).end();
        });

        router.get('/verify', async (req, res) => {
            const { token, userId } = req.query;

            if (typeof token !== 'string' || typeof userId !== 'string') {
                return res.status(400).end();
            }

            const dbToken = await adapter.findToken({
                userId: userId as string,
                type: 'verify',
            });

            if (!dbToken || !compare(token as string, dbToken.content)) {
                return res.status(400).end();
            }

            await adapter.updateUser(userId as string, {
                verified: true,
            });

            await adapter.deleteToken({
                userId: userId as string,
                type: 'verify',
            });

            const user = await adapter.findUser({ id: userId });

            if (!user) {
                return res.status(400).end();
            }

            sendRefreshToken(res, createRefreshToken(user));

            res.redirect('/');
        });

        router.post('/login', async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).send('All input is required');
            }

            const result = await adapter.findAuthMethod({
                type: 'credentials',
                value: email,
            });

            if (!result || !(await compare(password, result.secret!))) {
                return res.status(400).send('Invalid Credentials');
            }

            const token = createAccessToken(result.user);
            sendRefreshToken(res, createRefreshToken(result.user));

            res.json({
                token,
                user: result.user.name || result.user.email,
            });
        });

        router.post('/forgotten-password', async (req, res) => {
            const { email } = req.body;
            const user = await adapter.findUser({ email });

            if (user?.email) {
                await adapter.deleteToken({
                    userId: user.id,
                    type: 'reset-password',
                });

                const token = crypto.randomBytes(32).toString('hex');
                const url = new URL(
                    `/reset-password?token=${token}&userId=${user.id}`,
                    baseUrl
                );

                await adapter.createToken({
                    token: await hash(token, 10),
                    userId: user.id,
                    type: 'reset-password',
                });

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
            }

            res.end();
        });

        router.post('/reset-password', async (req, res) => {
            const { token, userId, password, passwordConfirm } =
                resetPasswordSchema.parse(req.body);

            const dbToken = await adapter.findToken({
                userId,
                type: 'reset-password',
            });

            if (password !== passwordConfirm) {
                return res
                    .status(400)
                    .send({ field: 'password-confirm', error: 'no-match' });
            }

            if (!dbToken || !compare(token, dbToken.content)) {
                return res.status(400).end();
            }

            const user = await adapter.findUser({ id: userId });

            if (!user) {
                return res.status(400).end();
            }

            const authMethod = await adapter.findAuthMethod({
                userId: user.id,
                type: 'credentials',
            });

            if (authMethod) {
                await adapter.updateAuthMethod(
                    {
                        type: 'credentials',
                        userId: user.id,
                    },
                    {
                        secret: await hash(password, 10),
                    }
                );
            } else {
                await adapter.createAuthMethod({
                    type: 'credentials',
                    userId: user.id,
                    value: user.email!,
                    secret: await hash(password, 10),
                });
            }

            await adapter.deleteToken({
                userId: user.id,
                type: 'reset-password',
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
