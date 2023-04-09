import { createElement } from '../utils/createElement.js';
import { sendRequest } from '../utils/sendRequest.js';
import { link } from './link.js';

export const profile = async () => {
    const response = await sendRequest('/api/url');
    const { links } = await response.json();

    return createElement('div', {
        style: 'display: flex; flex-direction: column; gap: 1rem;',
        children: [
            ...(await Promise.all(links.map(async (item) => link(item)))),
        ],
    });
};
