// @ts-check
import { copyToClipboard } from './clipboard.js';
import { sendRequest } from './request.js';
import { validateUrl, validateName, errors } from './validation.js';

const urlError = document.querySelector('.url-error');
const nameError = document.querySelector('.name-error');
const submitButton = document.querySelector('.create-container button');
const errorMessage = document.querySelector('.create-container .error');
const urlInput = document.querySelector('.create-container input[name="url"]');
const nameInput = document.querySelector(
    '.create-container input[name="name"]'
);
const passwordInput = document.querySelector(
    '.create-container input[name="password"]'
);
const limitInput = document.querySelector(
    '.create-container input[name="limit"]'
);
const createSuccess = document.querySelector('.create-container .success');
const copy = document.querySelector('.copy');
const copied = document.querySelector('.copied');

const createLink = async () => {
    errorMessage.classList.add('d-none');
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
                errorMessage.textContent = errors.unknown;
                errorMessage.classList.remove('d-none');
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
        new URL(name, window.location.origin).href
    );
};

const copyCreatedUrl = () => {
    copyToClipboard(createSuccess.getAttribute('data-url'));
    copy.classList.add('d-none');
    copied.classList.remove('d-none');
};

urlInput.addEventListener('input', () => urlError.classList.remove('show'));
nameInput.addEventListener('input', () => nameError.classList.remove('show'));
submitButton.addEventListener('click', createLink);
createSuccess.addEventListener('click', copyCreatedUrl);
