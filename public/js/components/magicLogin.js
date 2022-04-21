import { sendRequest } from '../utils/sendRequest.js';
import { navigateTo } from '../components/./router.js';
import { createFormValidator, email, required } from '../utils/validation.js';
import { createElement } from '../utils/createElement.js';
import { inputGroup } from './inputGroup.js';
import { success } from '../utils/notifications.js';

export const magicLogin = () => {
    const inputs = [
        {
            name: 'email',
            rules: [
                {
                    validator: email,
                    errorMessage: 'invalid email',
                },
                {
                    validator: required,
                    errorMessage: 'email is required',
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

        const request = await sendRequest('/api/auth/login/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                Object.fromEntries(new FormData(event.srcElement))
            ),
        });

        if (request.ok) {
            success({
                content: "we've sent you an email to log in with",
            });
        }
    };

    return createElement('form', {
        id: 'login-form',
        classList: ['login-container'],
        children: [
            createElement('h1', { text: 'login' }),
            inputGroup({
                name: 'email',
                type: 'email',
                id: 'login-email',
                label: 'email',
            }),
            createElement('button', { text: 'login', classList: ['btn'] }),
        ],
        events: {
            submit,
        },
    });
};
