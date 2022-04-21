import { createElement } from '../utils/createElement.js';

export const footer = () => {
    return createElement('footer', {
        children: [
            createElement('p', {
                text: 'srtr @ 2022',
            }),
        ],
    });
};
