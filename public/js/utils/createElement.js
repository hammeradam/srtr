export const createElement = (type, options = {}) => {
    const element = document.createElement(type);
    Object.entries(options).forEach(([key, value]) => {
        if (key === 'classList') {
            element.classList.add(...value.filter(Boolean));
            return;
        }

        if (key === 'text') {
            element.textContent = value;
            return;
        }

        if (key === 'html') {
            element.innerHTML = value;
            return;
        }

        if (key === 'children') {
            value.forEach((child) => child && element.appendChild(child));
            return;
        }

        if (key === 'events') {
            Object.entries(value).forEach(([type, listener]) => {
                element.addEventListener(type, listener);
            });
            return;
        }

        if (value) {
            element.setAttribute(key, value);
        }
    });
    return element;
};
