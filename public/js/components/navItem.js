import { createElement } from '../utils/createElement.js';
import { navigateTo } from '../components/./router.js';

const onLinkClicked = (event) => {
    event.preventDefault();
    const url = new URL(event.target.href);

    document
        .querySelectorAll('nav li a')
        .forEach((item) => item.classList.remove('active'));
    event.target.classList.add('active');

    navigateTo(url.pathname.substring(1));
};

export const navItem = (href, label) => {
    return createElement('li', {
        children: [
            createElement('a', {
                href,
                text: label,
                events: {
                    click: onLinkClicked,
                },
            }),
        ],
    });
};
