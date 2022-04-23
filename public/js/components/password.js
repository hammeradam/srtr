import { sendRequest } from '../utils/sendRequest.js';
import { createFormValidator, required } from '../utils/validation.js';
import { createElement } from '../utils/createElement.js';
import { inputGroup } from './inputGroup.js';
import { navigateTo } from './router.js';

export const password = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');

    if (!name) {
        return navigateTo('error');
    }

    const inputs = [
        {
            name: 'password',
            rules: [
                {
                    validator: required,
                    errorMessage: 'invalid email',
                },
            ],
        },
    ];
    const validate = createFormValidator(inputs);
    const submit = async (event) => {
        event.preventDefault();

        if (!validate(event.srcElement)) {
            return;
        }

        const request = await sendRequest('/api/url/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...Object.fromEntries(new FormData(event.srcElement)),
                name,
            }),
        });

        if (request.ok) {
            const response = await request.json();

            window.location.assign(response.url);
        }
    };

    return createElement('form', {
        id: 'password-form',
        classList: ['login-container'],
        children: [
            createElement('h1', { text: 'password' }),
            inputGroup({
                name: 'password',
                type: 'password',
                id: 'password',
                label: 'password',
            }),
            createElement('button', { text: 'submit', classList: ['btn'] }),
        ],
        events: {
            submit,
        },
    });
};
