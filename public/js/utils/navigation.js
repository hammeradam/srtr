import { check } from '../components/check.js';
import { create } from '../components/create.js';
import { forgotPassword } from '../components/forgotPassword.js';
import { login } from '../components/login.js';
import { register } from '../components/register.js';
import { resetPassword } from '../components/resetPassword.js';

const navItems = document.querySelectorAll('[data-container]');

export const navigateTo = (component) => {
    const main = document.querySelector('body main');
    main.innerHTML = '';
    navItems.forEach((item) => {
        item.classList.remove('active');
    });
    document
        .querySelector(`[data-container="${component}"]`)
        ?.classList.add('active');

    history.pushState(null, null, `/${component}`);

    switch (component) {
        case 'check':
            main.appendChild(check());
            break;
        case 'login':
            main.appendChild(login());
            break;
        case 'forgot-password':
            main.appendChild(forgotPassword());
            break;
        case 'register':
            main.appendChild(register());
            break;
        case 'reset-password':
            main.appendChild(resetPassword());
            break;
        default:
            main.appendChild(create());
            break;
    }
};

navItems.forEach((item) => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo(item.getAttribute('data-container'));
    });
});

navigateTo(window.location.pathname.substring(1));

// window.addEventListener('popstate', () =>
//     showComponent(window.location.pathname.substring(1))
// );

const dot = document.querySelector('.dot');
const nav = document.querySelector('nav');
dot.addEventListener('click', () => {
    dot.classList.toggle('active');
    nav.classList.toggle('open');
});
