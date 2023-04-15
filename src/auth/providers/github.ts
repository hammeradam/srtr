import express from 'express';
import { createRefreshToken, sendRefreshToken, getRedirectUri } from 'utils';
import { DatabaseAdapter } from 'controllers/authController';
import { get, post } from 'utils/request';

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

export interface GithubProviderOptions {
    baseUrl: string;
    clientId: string;
    clientSecret: string;
}

export const githubProvider =
    ({ clientId, clientSecret, baseUrl }: GithubProviderOptions) =>
    (adapter: DatabaseAdapter) => {
        interface GetGithubAccessTokenOptions {
            code: string;
            clientId: string;
            clientSecret: string;
        }

        const redirectUri = getRedirectUri(baseUrl, 'github');

        const getGithubAccessToken = async ({
            code,
            clientId,
            clientSecret,
        }: GetGithubAccessTokenOptions): Promise<string> => {
            const response = await post<{ access_token: string }>(
                GITHUB_TOKEN_URL,
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

            console.log(response);

            return response.access_token;
        };

        interface GithubData {
            id: number;
            login: string;
            email?: string;
        }

        const getGithubUserDetails = async (accessToken: string) => {
            const response = await get<GithubData>(GITHUB_USER_URL, {
                headers: {
                    Authorization: 'token ' + accessToken,
                },
            });

            return response;
        };

        const findOrCreateGithubUser = async (data: GithubData) => {
            const result = await adapter.findAuthMethod({
                type: 'github',
                value: String(data.id),
            });

            if (result) {
                return result.user;
            }

            let user = await adapter.findUser({ email: data?.email });

            if (!user) {
                user = await adapter.createUser({
                    name: data.login,
                    email: data?.email,
                });
            }

            if (!user.name && data.login) {
                await adapter.updateUser(user.id, { name: data.login });
            }

            await adapter.createAuthMethod({
                type: 'github',
                value: String(data.id),
                userId: user.id,
                secret: null,
            });

            return user;
        };

        const router = express.Router();

        router.get('/login/github', async (_req, res) => {
            const url = new URL('https://github.com/login/oauth/authorize');
            url.searchParams.append('client_id', clientId);
            url.searchParams.append('redirect_uri', redirectUri);

            res.redirect(url.href);
        });

        router.get('/callback/github', async (req, res) => {
            const accessToken = await getGithubAccessToken({
                code: String(req.query.code),
                clientId,
                clientSecret,
            });
            const userData = await getGithubUserDetails(accessToken);
            console.log(userData);
            const user = await findOrCreateGithubUser(userData);
            console.log(user);

            sendRefreshToken(res, createRefreshToken(user));

            res.redirect('/');
        });

        return router;
    };
