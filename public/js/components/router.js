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
import { link } from './link.js';
import { profile } from './profile.js';

export const navigateTo = async (path, props, options) => {
    const main = document.querySelector('body main');

    if (options?.pushState !== false) {
        history.pushState(null, null, `/${path}`);
    }

    main.innerHTML = '';

    const component = await getComponent(path)(props);
    if (component) {
        main.appendChild(component);
    }
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
        case 'profile':
            return profile;
        case path.match(/^link\/(.+)$/)?.input:
            return () => link({ name: path.match(/^link\/(.+)$/)[1] });
        case 'error':
            return error;
        case '':
            return create;
        default:
            return () => error({ code: 404 });
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
        navigateTo(window.location.pathname.substring(1), null, {
            pushState: false,
        });
    });

    return createElement('main');
};
