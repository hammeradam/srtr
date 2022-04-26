import { createElement } from '../utils/createElement.js';

export const footer = () => {
    return createElement('footer', {
        classList: ['footer'],
        children: [
            createElement('div', {
                classList: ['footer__links'],
                children: [
                    createElement('a', {
                        href: '/public/cookie_policy.pdf',
                        target: '_blank',
                        text: 'cookie policy',
                    }),
                    createElement('a', {
                        href: '/public/privacy_policy.pdf',
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
