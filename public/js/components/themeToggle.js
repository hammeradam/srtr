import { createElement } from '../utils/createElement.js';
import { moon } from './moon.js';
import { sun } from './sun.js';

export const themeToggle = () => {
    const body = document.querySelector('body');

    if (localStorage.getItem('isDark') === 'true') {
        body.classList.add('dark');
    }

    return createElement('button', {
        'aria-label': 'theme toggle',
        children: [sun(), moon()],
        events: {
            click: () => {
                body.classList.toggle('dark');
                localStorage.setItem('isDark', body.classList.contains('dark'));
            },
        },
    });
};
