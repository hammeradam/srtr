import { Express } from 'express';
import { authBuilder } from 'controllers/authController';
import linkController from 'controllers/linkController';
import rootController from 'controllers/rootController';

import { githubProvider } from 'auth/providers/github';
import { googleProvider } from 'auth/providers/google';
import { credentialsProvider } from 'auth/providers/credentials';
import { magicLinkProvider } from 'auth/providers/magicLink';

import { prismaAdapter } from 'auth/adapters/prisma';

export const registerControllers = (app: Express) => {
    app.use(
        '/api/auth',
        authBuilder({
            adapter: prismaAdapter(),
            providers: [
                githubProvider({
                    clientId: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                }),
                googleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }),
                credentialsProvider(),
                magicLinkProvider(),
            ],
        })
    );
    app.use('/api/url', linkController);
    app.use('/', rootController);
};
