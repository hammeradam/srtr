import { createElement } from '../utils/createElement.js';

import { check } from '../components/check.js';
import { create } from '../components/create.js';
import { forgotPassword } from '../components/forgotPassword.js';
import { login } from '../components/login.js';
import { magicLogin } from '../components/magicLogin.js';
import { register } from '../components/register.js';
import { resetPassword } from '../components/resetPassword.js';

export const navigateTo = (path, pushState = true) => {
    const main = document.querySelector('body main');

    if (pushState) {
        history.pushState(null, null, `/${path}`);
    }

    main.innerHTML = '';
    main.appendChild(getComponent(path)());
};

const getComponent = (path) => {
    switch (path) {
        case 'check':
            return check;
        case 'login':
            return login;
        case 'forgot-password':
            return forgotPassword;
        case 'register':
            return register;
        case 'reset-password':
            return resetPassword;
        case 'magic-login':
            return magicLogin;
        case '':
            return create;
        default:
            return () => createElement('div', { html: 'error' });
    }
};

export const router = () => {
    setTimeout(() => {
        navigateTo(window.location.pathname.substring(1), false);
        document
            .querySelector(`[href="${window.location.pathname}"]`)
            .classList.add('active');
    });

    window.addEventListener('popstate', () => {
        navigateTo(window.location.pathname.substring(1), false);
    });

    return createElement('main');
};
