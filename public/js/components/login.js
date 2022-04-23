import { sendRequest } from '../utils/sendRequest.js';
import { navigateTo } from '../components/./router.js';
import { createFormValidator, email, required } from '../utils/validation.js';
import { createElement } from '../utils/createElement.js';
import { inputGroup } from './inputGroup.js';
import {
    getGithubAuthUrl,
    getGoogleAuthUrl,
    setLogin,
} from '../utils/authentication.js';

export const login = () => {
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

        const request = await sendRequest('/api/auth/login', {
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
        classList: ['card'],
        children: [
            createElement('h1', { text: 'login' }),
            inputGroup({
                name: 'email',
                type: 'email',
                id: 'login-email',
                label: 'email',
            }),
            inputGroup({
                name: 'password',
                type: 'password',
                id: 'login-password',
                label: 'password',
            }),
            createElement('a', {
                href: '/forgot-password',
                text: 'forgot password?',
                classList: ['btn', 'forgot-password-btn'],
                events: {
                    click: (event) => {
                        event.preventDefault();
                        navigateTo('forgot-password');
                    },
                },
            }),
            createElement('button', { text: 'login', classList: ['btn'] }),
            createElement('hr'),
            createElement('a', {
                text: 'login with magic link',
                classList: ['btn'],
                href: '/magic-login',
                events: {
                    click: (event) => {
                        event.preventDefault();
                        navigateTo('magic-login');
                    },
                },
            }),
            createElement('a', {
                text: 'login with github',
                classList: ['btn'],
                href: getGithubAuthUrl(),
            }),
            createElement('a', {
                text: 'login with google',
                classList: ['btn'],
                href: getGoogleAuthUrl(),
            }),
        ],
        events: {
            submit,
        },
    });
};
