const createButton = document.querySelector('.create-container button');
const checkButton = document.querySelector('.check-container button');
const button = document.querySelector('.create-container button');
const urlInput = document.querySelector('input[name="url"]');
const nameInput = document.querySelector(
    '.create-container input[name="name"]'
);
const checkNameInput = document.querySelector(
    '.check-container input[name="name"]'
);
const createErrorMessage = document.querySelector('.create-container .error');
const checkErrorMessage = document.querySelector('.check-container .error');
const createSuccess = document.querySelector('.create-container .success');
const checkSuccess = document.querySelector('.check-container .success');
const copy = document.querySelector('.copy');
const copied = document.querySelector('.copied');
const urlError = document.querySelector('.url-error');
const nameError = document.querySelector('.name-error');
const createNameError = document.querySelector('.create-container .name-error');
const checkNameError = document.querySelector('.check-container .name-error');
const navItems = document.querySelectorAll('nav ul li[data-container]');
const containers = document.querySelectorAll('main > *');
const passwordInput = document.querySelector(
    '.create-container input[name="password"]'
);
const limitInput = document.querySelector(
    '.create-container input[name="limit"]'
);
const loginLink = document.querySelector('[data-container="login"]');
const registerLink = document.querySelector('[data-container="register"]');
const logoutLink = document.querySelector('.logout-link');

const errors = {
    name_taken: 'Name is already taken!',
    name_invalid: 'Invalid name! (A-z0-9-_.)',
    url_invalid: 'Invalid URL!',
    url_required: 'URL is required!',
    unknown: 'Something bad happened. Please try again later!',
};

let accessToken = '';

const copyToClipboard = (string) => {
    const element = document.createElement('textarea');
    element.value = string;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
};

const validateUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
};

const validateName = (string) => /^[A-z0-9-._]+$/.test(string);

urlInput.addEventListener('input', () => urlError.classList.remove('show'));

nameInput.addEventListener('input', () => nameError.classList.remove('show'));

logoutLink.addEventListener('click', async () => {
    await sendRequest('/api/auth/logout', {
        method: 'POST',
    });

    loginLink.style.display = 'block';
    registerLink.style.display = 'block';
    logoutLink.style.display = 'none';
    accessToken = '';
});

createButton.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log('create');
    createErrorMessage.classList.add('d-none');
    createSuccess.classList.add('d-none');
    urlError.classList.remove('show');
    nameError.classList.remove('show');

    if (!urlInput.value) {
        urlError.textContent = errors.url_required;
        urlError.classList.add('show');
        return;
    }

    if (!validateUrl(urlInput.value)) {
        urlError.textContent = errors.url_invalid;
        urlError.classList.add('show');
        return;
    }

    if (nameInput.value && !validateName(nameInput.value)) {
        nameError.textContent = errors.name_invalid;
        nameError.classList.add('show');
        return;
    }

    const response = await sendRequest('/api/url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: urlInput.value,
            name: nameInput.value,
            password: passwordInput.value,
            limit: limitInput.value,
        }),
    });

    if (!response.ok) {
        const { error, field } = await response.json();

        switch (field) {
            case 'name': {
                nameError.textContent = errors[error];
                nameError.classList.add('show');
                break;
            }
            case 'url': {
                urlError.textContent = errors[error];
                urlError.classList.add('show');
                break;
            }
            default: {
                createErrorMessage.textContent = errors.unknown;
                createErrorMessage.classList.remove('d-none');
                break;
            }
        }

        nameError.textContent = errors[error];
        nameError.classList.add('show');
        return;
    }
    const { name } = await response.json();

    createSuccess.classList.remove('d-none');
    copy.classList.remove('d-none');
    copied.classList.add('d-none');
    createSuccess.setAttribute(
        'data-url',
        new URL(name, window.location.origin)
    );
});

checkButton.addEventListener('click', async () => {
    checkNameError.classList.remove('show');
    checkErrorMessage.classList.add('d-none');
    checkSuccess.classList.add('d-none');

    if (!validateName(checkNameInput.value)) {
        checkNameError.textContent = errors.name_invalid;
        checkNameError.classList.add('show');
        return;
    }

    const response = await sendRequest(`/api/url/${checkNameInput.value}`);

    if (!response.ok) {
        if (response.status === 404) {
            checkErrorMessage.classList.remove('d-none');
            return;
        }
        const { error } = await response.json();
        checkNameError.textContent = errors[error];
        checkNameError.classList.add('show');
    }

    const { link } = await response.json();

    checkSuccess.classList.remove('d-none');
    checkSuccess.querySelector('span').textContent = link.hitCount;
    checkSuccess.querySelector('a').href = link.url;
    checkSuccess.querySelector('a').textContent = link.url;

    console.log(response);
});

createSuccess.addEventListener('click', () => {
    copyToClipboard(createSuccess.getAttribute('data-url'));
    copy.classList.add('d-none');
    copied.classList.remove('d-none');
});

navItems.forEach((item) => {
    item.addEventListener('click', () => {
        containers.forEach((container) => {
            container.classList.add('d-none');
        });

        navItems.forEach((item) => {
            item.classList.remove('active');
        });

        document
            .querySelector(`.${item.getAttribute('data-container')}-container`)
            .classList.remove('d-none');
        item.classList.add('active');
    });
});

window.addEventListener('DOMContentLoaded', async () => {
    const request = await sendRequest('/api/auth/refresh_token', {
        method: 'POST',
    });

    if (request.ok) {
        const response = await request.json();
        accessToken = response.accessToken;
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutLink.style.display = 'block';

        console.log(parseJwt(accessToken));
    } else {
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutLink.style.display = 'none';
        accessToken = '';
    }

    const linksRequest = await sendRequest('/api/url/own');

    if (linksRequest.ok) {
        const linksResponse = await linksRequest.json();

        console.log(linksResponse);
    }
});

const sendRequest = (path, options) => {
    return fetch(path, {
        credentials: 'include',
        ...options,
        headers: {
            ...options?.headers,
            authorization: 'Bearer: ' + accessToken,
        },
    });
};

const parseJwt = (token) =>
    JSON.parse(
        decodeURIComponent(
            atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
                .split('')
                .map(function (c) {
                    return (
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join('')
        )
    );
