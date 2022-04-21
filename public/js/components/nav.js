import { createElement } from '../utils/createElement.js';
import { logout } from './logout.js';
import { navItem } from './navItem.js';
import { themeToggle } from './themeToggle.js';

export const nav = () => {
    return createElement('div', {
        classList: ['navigation-container'],
        children: [
            createElement('nav', {
                children: [
                    createElement('ul', {
                        children: [
                            navItem('/', 'HOME'),
                            navItem('/check', 'CHECK'),
                            createElement('ul', {
                                classList: ['auth-links'],
                                children: [
                                    createElement('li', {
                                        id: 'darkModeToggle',
                                        children: [themeToggle()],
                                    }),
                                    navItem('/profile', ''),
                                    navItem('/login', 'LOGIN'),
                                    navItem('/register', 'REGISTER'),
                                    logout(),
                                ],
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
