import { createElement } from '../utils/createElement.js';
import { sendRequest } from '../utils/sendRequest.js';
import { link } from './link.js';

export const profile = async () => {
    const request = await sendRequest('/api/url');
    const { links } = await request.json();

    return createElement('div', {
        style: 'display: flex; flex-direction: column; gap: 1rem;',
        children: [
            ...(await Promise.all(links.map(async (item) => link(item)))),
        ],
    });
};
