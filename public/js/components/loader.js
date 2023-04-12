import { createElement } from '../utils/createElement.js';

export const loader = () => {
    return createElement('div', {
        classList: ['loader-wrapper'],
        children: [
            createElement('div', {
                classList: ['loader'],
            }),
        ],
    });
};
