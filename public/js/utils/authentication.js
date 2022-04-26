import { REFRESH_TOKEN_PATH, sendRequest } from './sendRequest.js';

// prettier-ignore
const BASE_URL = 'http://localhost:3000';
// prettier-ignore
const GITHUB_CLIENT_ID = '9fd26d2f35d5520e4f3a';
// prettier-ignore
const GOOGLE_CLIENT_ID = '697090043703-5v8qd9p8efre0pdfo6s2c2ci5k9pld16.apps.googleusercontent.com';

export const parseJwt = (token) => {
    if (!token) {
        return null;
    }

    return JSON.parse(
        decodeURIComponent(
            window
                .atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
                .split('')
                .map(function (c) {
                    return (
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join('')
        )
    );
};

export const checkLogin = async () => {
    const request = await sendRequest(REFRESH_TOKEN_PATH, {
        method: 'POST',
    });

    const response = await request.json();

    if (request.ok && response.token) {
        window.accessToken = response.token;

        return;
    }

    window.accessToken = '';
};

export const showLoggedInState = (user) => {
    document.querySelector('[href="/login"]').parentElement.style.display =
        'none';
    document.querySelector('[href="/register"]').parentElement.style.display =
        'none';
    document.querySelector('[href="/logout"]').parentElement.style.display =
        'block';
    const profileLink = document.querySelector('[href="/profile"]');
    profileLink.innerHTML = user;
    profileLink.parentElement.style.display = 'block';
};

export const showLoggedOutState = () => {
    document.querySelector('[href="/login"]').parentElement.style.display =
        'block';
    document.querySelector('[href="/register"]').parentElement.style.display =
        'block';
    document.querySelector('[href="/logout"]').parentElement.style.display =
        'none';

    const profileLink = document.querySelector('[href="/profile"]');
    profileLink.innerHTML = '';
    profileLink.parentElement.style.display = 'none';
};

const getRedirectUri = (provider) =>
    `${BASE_URL}/api/auth/callback/${provider}`;

export const getGithubAuthUrl = () => {
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.append('client_id', GITHUB_CLIENT_ID);
    url.searchParams.append('redirect_uri', getRedirectUri('github'));

    return url.href;
};

export const getGoogleAuthUrl = () => {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    url.searchParams.append('redirect_uri', getRedirectUri('google'));
    url.searchParams.append('scope', 'openid email profile');
    url.searchParams.append('response_type', 'code');

    return url.href;
};
