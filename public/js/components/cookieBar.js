import { createElement } from '../utils/createElement.js';

export const cookieBar = () => {
    if (document.cookie.includes('cookies=true')) {
        return null;
    }

    return createElement('div', {
        classList: ['cookieBar'],
        children: [
            createElement('p', {
                text: 'This website uses cookies to ensure you get the best experience on our website.',
            }),
            createElement('button', {
                classList: ['btn', 'btn--inverse', 'btn--sm'],
                text: 'Accept',
                events: {
                    click: () => {
                        document.cookie = 'cookies=true; max-age=31536000';
                        document.querySelector('.cookieBar').remove();
                    },
                },
            }),
        ],
    });
};
