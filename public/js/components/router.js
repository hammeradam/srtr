import { createElement } from '../utils/createElement.js';

import { check } from './check.js';
import { create } from './create.js';
import { forgotPassword } from './forgotPassword.js';
import { login } from './login.js';
import { magicLogin } from './magicLogin.js';
import { register } from './register.js';
import { resetPassword } from './resetPassword.js';
import { password } from './password.js';

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
        case 'password':
            return password;
        case '':
            return create;
        default:
            return () => createElement('div', { html: 'error' });
    }
};

export const router = () => {
    setTimeout(() => {
        navigateTo(window.location.pathname.substring(1), false);
        const navItem = document.querySelector(
            `[href="${window.location.pathname}"]`
        );

        if (navItem) {
            navItem.classList.add('active');
        }
    });

    window.addEventListener('popstate', () => {
        navigateTo(window.location.pathname.substring(1), false);
    });

    return createElement('main');
};
