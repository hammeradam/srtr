import { showLoggedInState } from '../utils/authentication.js';
import { createElement } from '../utils/createElement.js';
import { getQueryParam } from '../utils/getQueryParam.js';
import { sendRequest } from '../utils/sendRequest.js';
import { equals, required, createFormValidator } from '../utils/validation.js';
import { inputGroup } from './inputGroup.js';
import { navigateTo } from './router.js';

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

        // if (!validate(event.srcElement)) {
        //     return;
        // }

        const userId = getQueryParam('userId');
        const token = getQueryParam('token');
        console.log(userId, token);
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
            const response = await request.json();
            showLoggedInState(response.user);
            window.accessToken = response.token;
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
                name: 'passwordConfirm',
                type: 'password',
                id: 'reset-password-confirm',
                label: 'password confirmation',
            }),
            createElement('button', { text: 'reset', classList: ['btn'] }),
        ],
        events: {
            submit,
        },
    });
};
