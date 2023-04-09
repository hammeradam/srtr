import { parseJwt } from '../utils/authentication.js';
import { createElement } from '../utils/createElement.js';
import { logout } from './logout.js';
import { navItem } from './navItem.js';
import { themeToggle } from './themeToggle.js';

export const nav = () => {
    const tokenData = parseJwt(window.accessToken);

    return createElement('div', {
        classList: ['navigation-container'],
        children: [
            createElement('nav', {
                children: [
                    createElement('ul', {
                        children: [
                            navItem('/', 'HOME'),
                            navItem('/check', 'CHECK'),
                            createElement('li', {
                                classList: ['nav-separator'],
                            }),
                            navItem(
                                '/profile',
                                tokenData?.name ?? tokenData?.email ?? '',
                                {
                                    style: `display: ${
                                        tokenData ? 'block' : 'none'
                                    };`,
                                }
                            ),
                            navItem('/login', 'LOGIN', {
                                style: `display: ${
                                    tokenData ? 'none' : 'block'
                                };`,
                            }),
                            navItem('/register', 'REGISTER', {
                                style: `display: ${
                                    tokenData ? 'none' : 'block'
                                };`,
                            }),
                            logout({
                                style: `display: ${
                                    tokenData ? 'block' : 'none'
                                };`,
                            }),
                            createElement('li', {
                                id: 'darkModeToggle',
                                children: [themeToggle()],
                            }),
                        ],
                    }),
                ],
            }),
            createElement('div', {
                classList: ['dot'],
                events: {
                    click: (event) => {
                        event.target.classList.toggle('active');
                        document.querySelector('nav').classList.toggle('open');
                    },
                },
            }),
        ],
    });
};
