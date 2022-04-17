import { navigateTo } from '../utils/navigation.js';
import { sendRequest } from '../utils/sendRequest.js';
import { createElement } from '../utils/createElement.js';
import {
    createFormValidator,
    email,
    errors,
    required,
} from '../utils/validation.js';
import { inputGroup } from './inputGroup.js';
import { setLogin } from '../utils/authentication.js';

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
            setLogin(request);
            navigateTo('');
        }
    };

    return createElement('form', {
        id: 'register-form',
        classList: ['register-container'],
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