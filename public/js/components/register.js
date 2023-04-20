import { navigateTo } from '../components/./router.js';
import { sendRequest } from '../utils/sendRequest.js';
import { createElement } from '../utils/createElement.js';
import {
    createFormValidator,
    email,
    errors,
    required,
} from '../utils/validation.js';
import { inputGroup } from './inputGroup.js';
import { success } from '../utils/notifications.js';

export const register = () => {
    const inputs = [
        {
            name: 'email',
            rules: [
                {
                    validator: email,
                    errorMessage: errors.email_invalid,
                },
                {
                    validator: required,
                    errorMessage: errors.email_required,
                },
            ],
        },
        {
            name: 'password',
            rules: [
                {
                    validator: required,
                    errorMessage: 'password is required',
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

        const request = await sendRequest('/api/auth/register', {
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
                content: 'jeeee',
            });
        }
    };

    return createElement('form', {
        classList: ['card'],
        children: [
            createElement('h1', { text: 'register' }),
            inputGroup({
                name: 'email',
                type: 'email',
                id: 'register-email',
                label: 'email',
            }),
            inputGroup({
                name: 'password',
                type: 'password',
                id: 'register-password',
                label: 'password',
            }),
            createElement('button', { text: 'register', classList: ['btn'] }),
        ],
        events: {
            submit,
        },
    });
};
