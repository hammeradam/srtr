const notificationContainer = document.querySelector('#notificationContainer');

const remove = (notification) => {
    // if (notification) {
    //     notification.classList.add('remove');

    //     setTimeout(() => {
    notification.remove();
    //     }, 600);
    // }
};

const create = ({ text, timeout = 4000, isClosable = true, type = 'info' }) => {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerHTML = text;

    if (timeout) {
        setTimeout(() => remove(notification), timeout);
    }

    if (isClosable) {
        notification.classList.add('can-close');
        const close = document.createElement('div');
        close.innerHTML = '&#10005;';
        close.classList.add('notification__close');
        notification.appendChild(close);

        close.addEventListener('click', () => remove(notification));
    }

    notificationContainer.appendChild(notification);
};

// const interval = setInterval(() => {
// create({
//     text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus dignissimos quibusdam repellendus excepturi ea a sit pariatur ex nulla earum, sed corrupti? Magnam dolorem sunt eos culpa, dolor quibusdam odio.',
//     timeout: 0,
// });
// create({
//     text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
//     timeout: 0,
//     type: 'success',
// });
// create({
//     text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus dignissimos quibusdam repellendus excepturi ea a sit pariatur ex nulla earum, sed corrupti? Magnam dolorem sunt eos culpa, dolor quibusdam odio.',
//     timeout: 0,
//     type: 'warning',
// });
// create({
//     text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
//     timeout: 0,
//     type: 'error',
// });
// }, 1000);

// setTimeout(() => {
//     clearInterval(interval);
// }, 2000);

export {};
