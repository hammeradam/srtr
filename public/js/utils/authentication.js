import { REFRESH_TOKEN_PATH, sendRequest } from './sendRequest.js';

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

const login = async (request) => {
    const response = await request.json();
    window.accessToken = response.token;
    showLoggedInState(response.user);
};

export const checkLogin = async () => {
    const request = await sendRequest(REFRESH_TOKEN_PATH, {
        method: 'POST',
    });

    if (request.ok) {
        login(request);
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

const showLoggedInState = (user) => {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutLink.style.display = 'block';

    profileLink.innerHTML = user;
    profileLink.style.display = 'block';
};

const showLoggedOutState = () => {
    loginLink.style.display = 'block';
    registerLink.style.display = 'block';
    logoutLink.style.display = 'none';

    profileLink.innerHTML = '';
    profileLink.style.display = 'none';
};

logoutLink.addEventListener('click', async () => {
    await sendRequest('/api/auth/logout', {
        method: 'POST',
    });

    navigateTo('create');
    showLoggedOutState();
    window.accessToken = '';
});
