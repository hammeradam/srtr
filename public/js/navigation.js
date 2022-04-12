const navItems = document.querySelectorAll('[data-container]');
const containers = document.querySelectorAll('main > *');

export const showComponent = (component, hideOthers = true) => {
    if (hideOthers) {
        containers.forEach((container) => {
            container.classList.add('d-none');
        });

        navItems.forEach((item) => {
            item.classList.remove('active');
        });
    }

    document
        .querySelector(`.${component}-container`)
        ?.classList.remove('d-none');

    document
        .querySelector(`[data-container="${component}"]`)
        ?.classList.add('active');
};

export const navigateTo = (component) => {
    showComponent(component);

    history.pushState(
        null,
        null,
        `/${component === 'create' ? '' : component}`
    );
};

navItems.forEach((item) => {
    item.addEventListener('click', () =>
        navigateTo(item.getAttribute('data-container'))
    );
});

showComponent(window.location.pathname.substring(1) || 'create', false);

window.addEventListener('popstate', () =>
    showComponent(window.location.pathname.substring(1) || 'create')
);

const dot = document.querySelector('.dot');
const nav = document.querySelector('nav');
dot.addEventListener('click', () => {
    dot.classList.toggle('active');
    nav.classList.toggle('open');
});
