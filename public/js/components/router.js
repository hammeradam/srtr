import { createElement } from '../utils/createElement.js';

import { check } from './check.js';
import { create } from './create.js';
import { forgotPassword } from './forgotPassword.js';
import { login } from './login.js';
import { magicLogin } from './magicLogin.js';
import { register } from './register.js';
import { resetPassword } from './resetPassword.js';
import { password } from './password.js';
import { error } from './error.js';
import { created } from './created.js';

export const navigateTo = (path, props, { pushState = true }) => {
    const main = document.querySelector('body main');

    if (pushState) {
        history.pushState(null, null, `/${path}`);
    }

    main.innerHTML = '';
    main.appendChild(getComponent(path)(props));
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
        case 'created':
            return created;
        case '':
            return create;
        default:
            return error;
    }
};

export const router = () => {
    setTimeout(() => {
        navigateTo(window.location.pathname.substring(1), null, {
            pushState: false,
        });
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
