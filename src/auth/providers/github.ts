import express from 'express';
import axios from 'axios';
import { createRefreshToken, sendRefreshToken, getRedirectUri } from 'utils';
import { DatabaseAdapter } from 'controllers/authController';

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

export interface GithubProviderOptions {
    clientId: string;
    clientSecret: string;
}

export const githubProvider =
    ({ clientId, clientSecret }: GithubProviderOptions) =>
    (adapter: DatabaseAdapter) => {
        interface GetGithubAccessTokenOptions {
            code: string;
            clientId: string;
            clientSecret: string;
        }

        const getGithubAccessToken = async ({
            code,
            clientId,
            clientSecret,
        }: GetGithubAccessTokenOptions): Promise<string> => {
            const response = await axios.post(
                GITHUB_TOKEN_URL,
                {},
                {
                    params: {
                        client_id: clientId,
                        client_secret: clientSecret,
                        code,
                    },
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            return response.data.access_token;
        };

        interface GithubData {
            id: number;
            login: string;
            email?: string;
        }

        const getGithubUserDetails = async (accessToken: string) => {
            const response = await axios.get<GithubData>(GITHUB_USER_URL, {
                headers: {
                    Authorization: 'token ' + accessToken,
                },
            });

            return response.data;
        };

        const findOrCreateGithubUser = async (data: GithubData) => {
            const user = await adapter.findUser({ githubId: data.id });

            if (user) {
                return user;
            }

            const newUser = await adapter.createUser({
                githubId: data.id,
                name: data.login,
                email: data?.email,
            });

            return newUser;
        };

        const router = express.Router();

        router.get('/login/github', async (_req, res) => {
            const url = new URL('https://github.com/login/oauth/authorize');
            url.searchParams.append('client_id', clientId);
            url.searchParams.append('redirect_uri', getRedirectUri('github'));

            res.redirect(url.href);
        });

        router.get('/callback/github', async (req, res) => {
            const accessToken = await getGithubAccessToken({
                code: String(req.query.code),
                clientId,
                clientSecret,
            });
            const userData = await getGithubUserDetails(accessToken);
            const user = await findOrCreateGithubUser(userData);

            sendRefreshToken(res, createRefreshToken(user));

            res.redirect('/');
        });

        return router;
    };
