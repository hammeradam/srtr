import { sendRequest } from '../utils/sendRequest.js';
import { createFormValidator, required } from '../utils/validation.js';
import { createElement } from '../utils/createElement.js';
import { inputGroup } from './inputGroup.js';
import { navigateTo } from './router.js';
import { getQueryParam } from '../utils/getQueryParam.js';

export const password = () => {
    const name = getQueryParam('name');

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
        classList: ['card'],
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
