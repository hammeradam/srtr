// @ts-check
import { createElement } from '../utils/createElement.js';
import { sendRequest } from '../utils/sendRequest.js';
import {
    createFormValidator,
    errors,
    name,
    optional,
    required,
    url,
} from '../utils/validation.js';
import { inputGroup } from './inputGroup.js';

export const create = () => {
    const inputs = [
        {
            name: 'url',
            rules: [
                {
                    validator: url,
                    errorMessage: errors.url_invalid,
                },
                {
                    validator: required,
                    errorMessage: errors.url_required,
                },
            ],
        },
        {
            name: 'name',
            rules: [
                {
                    validator: optional(name),
                    errorMessage: errors.name_invalid,
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

        const response = await sendRequest('/api/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                Object.fromEntries(new FormData(event.srcElement))
            ),
        });

        if (!response.ok) {
            const { error, field } = await response.json();

            // switch (field) {
            //     case 'name': {
            //         nameError.textContent = errors[error];
            //         nameError.classList.add('show');
            //         break;
            //     }
            //     case 'url': {
            //         urlError.textContent = errors[error];
            //         urlError.classList.add('show');
            //         break;
            //     }
            //     default: {
            //         errorMessage.textContent = errors.unknown;
            //         errorMessage.classList.remove('d-none');
            //         break;
            //     }
            // }

            // nameError.textContent = errors[error];
            // nameError.classList.add('show');
            return;
        }
        const { name } = await response.json();

        // createSuccess.classList.remove('d-none');
        // copy.classList.remove('d-none');
        // copied.classList.add('d-none');
        // createSuccess.setAttribute(
        //     'data-url',
        //     new URL(`l/${name}`, window.location.origin).href
        // );
    };

    return createElement('form', {
        id: 'create-form',
        classList: ['create-container'],
        children: [
            createElement('h1', { text: 'srtr' }),
            inputGroup({
                name: 'url',
                type: 'url',
                id: 'create-url',
                label: 'url',
            }),
            inputGroup({
                name: 'name',
                type: 'text',
                id: 'create-name',
                label: 'name',
            }),
            createElement('details', {
                children: [
                    createElement('summary', { text: 'settings' }),
                    inputGroup({
                        name: 'password',
                        type: 'password',
                        id: 'create-password',
                        label: 'password',
                    }),
                    inputGroup({
                        name: 'limit',
                        type: 'number',
                        id: 'create-limit',
                        label: 'usage limit',
                    }),
                ],
            }),
            createElement('button', { text: 'shorten', classList: ['btn'] }),
        ],
        events: {
            submit,
        },
    });
};
