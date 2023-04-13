import { createElement } from '../utils/createElement.js';
import { moon } from './moon.js';
import { sun } from './sun.js';

export const themeToggle = () => {
    return createElement('button', {
        'aria-label': 'theme toggle',
        children: [sun(), moon()],
        events: {
            click: () => {
                const wasDark =
                    document.documentElement.classList.contains('dark');

                if (wasDark) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                }

                localStorage.setItem('isDark', !wasDark);
            },
        },
    });
};
