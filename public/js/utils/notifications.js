import { createElement } from './createElement.js';

const notificationContainer = document.querySelector('#notificationContainer');

const remove = (notification) => {
    notification.classList.add('notification--remove');

    setTimeout(() => {
        notification.remove();
    }, 500);
};

const create = ({
    title = '',
    content = '',
    timeout = 5000,
    isClosable = true,
    type = 'info',
}) => {
    const notification = createElement('div', {
        classList: [
            'notification',
            type,
            isClosable && 'notification--is-closable',
        ],
        children: [
            createElement('div', {
                children: [
                    !!title &&
                        createElement('h3', {
                            classList: ['notification__title'],
                            text: title,
                        }),
                    createElement('p', {
                        text: content,
                    }),
                ],
            }),
            isClosable &&
                createElement('div', {
                    classList: ['notification__close'],
                    html: '&#10005;',
                    events: {
                        click: () => remove(notification),
                    },
                }),
        ],
    });

    if (timeout) {
        setTimeout(() => remove(notification), timeout);
    }

    notificationContainer.appendChild(notification);
};

export const info = ({ title, content, timeout, isClosable }) =>
    create({
        title,
        content,
        timeout,
        isClosable,
        type: 'info',
    });

export const success = ({ title, content, timeout, isClosable }) =>
    create({
        title,
        content,
        timeout,
        isClosable,
        type: 'success',
    });

export const warning = ({ title, content, timeout, isClosable }) =>
    create({
        title,
        content,
        timeout,
        isClosable,
        type: 'warning',
    });

export const error = ({ title, content, timeout, isClosable }) =>
    create({
        title,
        content,
        timeout,
        isClosable,
        type: 'error',
    });
