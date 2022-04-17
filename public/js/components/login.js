import { sendRequest } from '../utils/sendRequest.js';
import { navigateTo } from '../utils/navigation.js';
import { createFormValidator, email, required } from '../utils/validation.js';
import { createElement } from '../utils/createElement.js';
import { inputGroup } from './inputGroup.js';
import { getRedirectUri, setLogin } from '../utils/authentication.js';

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
            inputGroup({
                name: 'password',
                type: 'password',
                id: 'login-password',
                label: 'password',
            }),
            createElement('button', {
                text: 'forgot password?',
                classList: ['btn', 'forgot-password-btn'],
                'data-container': 'forgot-password',
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
                text: 'login with github',
                classList: ['btn'],
                href: `https://github.com/login/oauth/authorize?client_id=9fd26d2f35d5520e4f3a&redirect_uri=${getRedirectUri(
                    'github'
                )}`,
            }),
            createElement('a', {
                text: 'login with google',
                classList: ['btn'],
                href: `https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20email%20profile&response_type=code&redirect_uri=${getRedirectUri(
                    'github'
                )}&client_id=697090043703-5v8qd9p8efre0pdfo6s2c2ci5k9pld16.apps.googleusercontent.com`,
            }),
        ],
        events: {
            submit,
        },
    });
};
