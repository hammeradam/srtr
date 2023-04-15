import { REFRESH_TOKEN_PATH, sendRequest } from './sendRequest.js';

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

    if (!request.ok) {
        window.accessToken = null;

        return;
    }

    const response = await request.json();

    if (response.token) {
        window.accessToken = response.token;

        return;
    }

    window.accessToken = null;
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
