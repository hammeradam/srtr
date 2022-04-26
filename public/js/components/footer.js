import { createElement } from '../utils/createElement.js';

export const footer = () => {
    return createElement('footer', {
        classList: ['footer'],
        children: [
            createElement('div', {
                classList: ['footer__links'],
                children: [
                    createElement('a', {
                        href: '',
                        target: '_blank',
                        text: 'cookie policy',
                    }),
                    createElement('a', {
                        href: '',
                        target: '_blank',
                        text: 'privacy policy',
                    }),
                ],
            }),
            createElement('p', {
                text: 'srtr @ 2022',
            }),
        ],
    });
};
