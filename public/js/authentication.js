import { sendRequest } from './request.js';
import { navigateTo } from './navigation.js';
import { createFormValidator, email, equals, required } from './validation.js';

const parseJwt = (token) =>
    JSON.parse(
        decodeURIComponent(
            window
                .atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
                .split('')
                .map(function (c) {
                    return (
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join('')
        )
    );

const loginLink = document.querySelector('[data-container="login"]');
const registerLink = document.querySelector('[data-container="register"]');
const logoutLink = document.querySelector('.logout-link');

const showLoggedInState = () => {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutLink.style.display = 'block';
};

const showLoggedOutState = () => {
    loginLink.style.display = 'block';
    registerLink.style.display = 'block';
    logoutLink.style.display = 'none';
};

const getAccessToken = async () => {
    const request = await sendRequest('/api/auth/refresh_token', {
        method: 'POST',
    });

    if (request.ok) {
        const response = await request.json();
        window.accessToken = response.accessToken;
        showLoggedInState();
    } else {
        showLoggedOutState();
        window.accessToken = '';
    }
};

getAccessToken();

logoutLink.addEventListener('click', async () => {
    await sendRequest('/api/auth/logout', {
        method: 'POST',
    });

    showLoggedOutState();
    window.accessToken = '';
});

// login
const loginForm = document.querySelector('#login-form');
const loginFormInputs = [
    {
        element: document.querySelector('#login-email'),
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
        element: document.querySelector('#login-password'),
        rules: [
            {
                validator: required,
                errorMessage: 'password is required',
            },
        ],
    },
];
const validateLoginForm = createFormValidator(loginFormInputs);

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateLoginForm()) {
        return;
    }

    const request = await sendRequest('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(loginForm))),
    });

    if (request.ok) {
        const response = await request.json();
        window.accessToken = response.token;

        navigateTo('create');
        showLoggedInState();
    }
});

// register
const registerForm = document.querySelector('#register-form');
const registerFormInputs = [
    {
        element: document.querySelector('#register-email'),
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
        element: document.querySelector('#register-password'),
        rules: [
            {
                validator: required,
                errorMessage: 'password is required',
            },
        ],
    },
];
const validateRegisterForm = createFormValidator(registerFormInputs);

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateRegisterForm()) {
        return;
    }

    const request = await sendRequest('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(registerForm))),
    });

    if (request.ok) {
        const response = await request.json();
        window.accessToken = response.token;

        navigateTo('create');
        showLoggedInState();
    }
});

// forgot password
const forgotPasswordForm = document.querySelector('#forgot-password-form');
const forgotPasswordFormInputs = [
    {
        element: document.querySelector('#forgot-password-email'),
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
const validateForgotPasswordForm = createFormValidator(
    forgotPasswordFormInputs
);

forgotPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForgotPasswordForm()) {
        return;
    }

    const request = await sendRequest('/api/auth/forgotten-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            Object.fromEntries(new FormData(forgotPasswordForm))
        ),
    });

    if (request.ok) {
        console.log('yaay');
    }
});

// reset password
const resetPasswordForm = document.querySelector('#reset-password-form');
const resetPasswordFormInputs = [
    {
        element: document.querySelector('#reset-password'),
        rules: [
            {
                validator: required,
                errorMessage: 'password is required',
            },
        ],
    },
    {
        element: document.querySelector('#reset-password-confirm'),
        rules: [
            {
                validator: required,
                errorMessage: 'password confirmation is required',
            },
            {
                validator: equals(document.querySelector('#reset-password')),
                errorMessage: 'confirmation must match',
            },
        ],
    },
];
const validateResetPasswordForm = createFormValidator(resetPasswordFormInputs);

resetPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateResetPasswordForm()) {
        return;
    }

    const queryParams = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    const userId = queryParams.userId;
    const token = queryParams.token;

    const request = await sendRequest('/api/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...Object.fromEntries(new FormData(resetPasswordForm)),
            userId,
            token,
        }),
    });

    if (request.ok) {
        const response = await request.json();
        window.accessToken = response.token;

        navigateTo('create');
        showLoggedInState();
    }
});
