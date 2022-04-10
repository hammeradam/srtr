// @ts-check
import { sendRequest} from './request.js';

const loginLink = document.querySelector('[data-container="login"]');
const registerLink = document.querySelector('[data-container="register"]');
const logoutLink = document.querySelector('.logout-link');

const parseJwt = (token) =>
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

const getAccessToken = async () => {
    const request = await sendRequest('/api/auth/refresh_token', {
        method: 'POST',
    });

    if (request.ok) {
        const response = await request.json();
        window.accessToken = response.accessToken;
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutLink.style.display = 'none';
        window.accessToken = '';
    }
}

getAccessToken();

logoutLink.addEventListener('click', async () => {
    await sendRequest('/api/auth/logout', {
        method: 'POST',
    });

    loginLink.style.display = 'block';
    registerLink.style.display = 'block';
    logoutLink.style.display = 'none';
    window.accessToken = '';
});