import { sendRequest } from '../utils/sendRequest.js';
import { createElement } from '../utils/createElement.js';
import {
    errors,
    required,
    createFormValidator,
    email,
} from '../utils/validation.js';
import { success, error } from '../utils/notifications.js';
import { inputGroup } from './inputGroup.js';

export const forgotPassword = () => {
    const inputs = [
        {
            name: 'email',
            rules: [
                {
                    validator: required,
                    errorMessage: errors.email_required,
                },
                {
                    validator: email,
                    errorMessage: errors.email_invalid,
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

        const request = await sendRequest('/api/auth/forgotten-password', {
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
                content:
                    'if there is an account with the given address, we sent an email to reset your password',
            });

            return;
        }

        error({ content: errors.unknown });
    };

    return createElement('form', {
        classList: ['card'],
        children: [
            createElement('h1', { text: 'forgot password' }),
            inputGroup({
                name: 'email',
                type: 'text',
                id: 'forgot-password-email',
                label: 'email',
            }),
            createElement('button', { text: 'submit', classList: ['btn'] }),
        ],
        events: {
            submit,
        },
    });
};
