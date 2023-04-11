import express from 'express';
import axios from 'axios';
import { createRefreshToken, sendRefreshToken, getRedirectUri } from 'utils';
import { DatabaseAdapter } from 'controllers/authController';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';

export interface GoogleProviderOptions {
    clientId: string;
    clientSecret: string;
}

export const googleProvider =
    ({ clientId, clientSecret }: GoogleProviderOptions) =>
    (adapter: DatabaseAdapter) => {
        interface GetGoogleAccessTokenOptions {
            code: string;
            clientId: string;
            clientSecret: string;
        }

        const getGoogleAccessToken = async ({
            code,
            clientId,
            clientSecret,
        }: GetGoogleAccessTokenOptions): Promise<string> => {
            const params = new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                redirect_uri: getRedirectUri('google'),
                code,
            });

            const response = await axios.post(
                GOOGLE_TOKEN_URL,
                params.toString(),
                {
                    headers: {
                        Accept: 'application/x-www-form-urlencoded',
                    },
                }
            );

            return response.data.access_token;
        };

        interface GoogleData {
            id: string;
            name: string;
            email: string;
        }

        const getGoogleUserDetails = async (
            accessToken: string
        ): Promise<GoogleData> => {
            const response = await axios.get<GoogleData>(GOOGLE_USER_URL, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                },
            });

            return response.data;
        };

        const findOrCreateGoogleUser = async (data: GoogleData) => {
            const user = await adapter.findUser({ googleId: data.id });

            if (user) {
                return user;
            }

            const newUser = await adapter.createUser({
                googleId: data.id,
                name: data.name,
                email: data.email,
            });

            return newUser;
        };

        const router = express.Router();

        router.get('/login/google', async (_req, res) => {
            const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
            url.searchParams.append('client_id', clientId);
            url.searchParams.append('redirect_uri', getRedirectUri('google'));
            url.searchParams.append('scope', 'openid email profile');
            url.searchParams.append('response_type', 'code');

            res.redirect(url.href);
        });

        router.get('/callback/google', async (req, res) => {
            const accessToken = await getGoogleAccessToken({
                code: String(req.query.code),
                clientId,
                clientSecret,
            });
            const userData = await getGoogleUserDetails(accessToken);
            const user = await findOrCreateGoogleUser(userData);

            if (user) {
                sendRefreshToken(res, createRefreshToken(user));
            }

            res.redirect('/');
        });

        return router;
    };
