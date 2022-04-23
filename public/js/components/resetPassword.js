import { createElement } from '../utils/createElement.js';
import { equals, required, createFormValidator } from '../utils/validation.js';
import { inputGroup } from './inputGroup.js';

export const resetPassword = () => {
    const inputs = [
        {
            name: 'password',
            rules: [
                {
                    validator: required,
                    errorMessage: 'password is required',
                },
            ],
        },
        {
            name: 'password-confirm',
            rules: [
                {
                    validator: required,
                    errorMessage: 'password confirmation is required',
                },
                {
                    validator: equals(
                        document.querySelector('#reset-password')
                    ),
                    errorMessage: 'confirmation must match',
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

        const queryParams = new Proxy(
            new URLSearchParams(window.location.search),
            {
                get: (searchParams, prop) => searchParams.get(prop),
            }
        );

        const userId = queryParams.userId;
        const token = queryParams.token;

        const request = await sendRequest('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...Object.fromEntries(new FormData(event.srcElement)),
                userId,
                token,
            }),
        });

        if (request.ok) {
            login(request);
            navigateTo('');
        }
    };

    return createElement('form', {
        classList: ['card'],
        children: [
            createElement('h1', { text: 'reset password' }),
            inputGroup({
                name: 'password',
                type: 'password',
                id: 'reset-password',
                label: 'password',
            }),
            inputGroup({
                name: 'password-confirm',
                type: 'password',
                id: 'reset-password-confirm',
                label: 'password confirmation',
            }),
            createElement('reset', { text: 'login', classList: ['btn'] }),
        ],
        events: {
            submit,
        },
    });
};
