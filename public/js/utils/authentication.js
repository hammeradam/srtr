import { navigateTo } from './navigation.js';
import { REFRESH_TOKEN_PATH, sendRequest } from './sendRequest.js';

const BASE_URL = 'http://localhost:3000';
const GITHUB_CLIENT_ID = '9fd26d2f35d5520e4f3a';

export const parseJwt = (token) =>
    JSON.parse(
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

export const setLogin = async (request) => {
    const response = await request.json();
    window.accessToken = response.token;
    showLoggedInState(response.user);
};

export const checkLogin = async () => {
    const request = await sendRequest(REFRESH_TOKEN_PATH, {
        method: 'POST',
    });

    if (request.ok) {
        setLogin(request);
    } else {
        showLoggedOutState();
        window.accessToken = '';
    }
};

checkLogin();

const loginLink = document.querySelector('[data-container="login"]');
const registerLink = document.querySelector('[data-container="register"]');
const logoutLink = document.querySelector('.logout-link');
const profileLink = document.querySelector('[data-container="profile"]');

export const showLoggedInState = (user) => {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutLink.style.display = 'block';

    profileLink.innerHTML = user;
    profileLink.style.display = 'block';
};

export const showLoggedOutState = () => {
    loginLink.style.display = 'block';
    registerLink.style.display = 'block';
    logoutLink.style.display = 'none';

    profileLink.innerHTML = '';
    profileLink.style.display = 'none';
};

logoutLink.addEventListener('click', async (event) => {
    event.preventDefault();
    await sendRequest('/api/auth/logout', {
        method: 'POST',
    });

    navigateTo('');
    showLoggedOutState();
    window.accessToken = '';
});

export const getGithubAuthUrl = () =>
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${getRedirectUri(
        'github'
    )}`;

export const getRedirectUri = (provider) =>
    `${BASE_URL}/api/auth/callback/${provider}`;
