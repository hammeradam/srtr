import { createElement } from '../utils/createElement.js';
import { moon } from './moon.js';
import { sun } from './sun.js';

export const themeToggle = () => {
    return createElement('button', {
        'aria-label': 'theme toggle',
        children: [sun(), moon()],
        events: {
            click: () => {
                document.documentElement.classList.toggle('dark');
                localStorage.setItem(
                    'isDark',
                    document.documentElement.classList.contains('dark')
                );
            },
        },
    });
};
