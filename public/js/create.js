import { copyToClipboard } from './clipboard.js';
import { sendRequest } from './request.js';
import {
    url,
    name,
    errors,
    required,
    optional,
    createFormValidator,
} from './validation.js';

const urlError = document.querySelector('.url-error');
const nameError = document.querySelector('.name-error');
const errorMessage = document.querySelector('.create-container .error');
const createSuccess = document.querySelector('.create-container .success');
const copy = document.querySelector('.copy');
const copied = document.querySelector('.copied');

createSuccess.addEventListener('click', () => {
    copyToClipboard(createSuccess.getAttribute('data-url'));
    copy.classList.add('d-none');
    copied.classList.remove('d-none');
});

const createForm = document.querySelector('#create-form');
const createFormInputs = [
    {
        element: document.querySelector('#create-url'),
        rules: [
            {
                validator: url,
                errorMessage: errors.url_invalid,
            },
            {
                validator: required,
                errorMessage: errors.url_required,
            },
        ],
    },
    {
        element: document.querySelector('#create-name'),
        rules: [
            {
                validator: optional(name),
                errorMessage: errors.name_invalid,
            },
        ],
    },
];
const validateCreateForm = createFormValidator(createFormInputs);

createForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateCreateForm()) {
        return;
    }

    const response = await sendRequest('/api/url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(createForm))),
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
        new URL(`l/${name}`, window.location.origin).href
    );
});
