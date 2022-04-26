import { createElement } from '../utils/createElement.js';
import { footer } from './footer.js';
import { nav } from './nav.js';
import { cookieBar } from './cookieBar.js';
import { router } from './router.js';

export const app = () => {
    return createElement('div', {
        id: 'root',
        children: [nav(), router(), footer(), cookieBar()],
    });
};
