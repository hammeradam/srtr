import { sendRequest } from '../utils/sendRequest.js';
import { createElement } from '../utils/createElement.js';
import {
    errors,
    name,
    required,
    createFormValidator,
} from '../utils/validation.js';
import { inputGroup } from './inputGroup.js';

export const check = () => {
    const inputs = [
        {
            name: 'name',
            rules: [
                {
                    validator: required,
                    errorMessage: errors.name_required,
                },
                {
                    validator: name,
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

        const values = Object.fromEntries(new FormData(event.srcElement));

        const response = await sendRequest(`/api/url/${values.name}`);

        if (!response.ok) {
            if (response.status === 404) {
                return;
            }
        }

        const { link } = await response.json();
    };

    return createElement('form', {
        classList: ['card'],
        children: [
            createElement('h1', { text: 'check' }),
            inputGroup({
                name: 'name',
                type: 'text',
                id: 'check-name',
                label: 'name',
            }),
            createElement('button', { text: 'check', classList: ['btn'] }),
        ],
        events: {
            submit,
        },
    });
};
