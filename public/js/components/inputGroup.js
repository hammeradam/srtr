import { createElement } from '../utils/createElement.js';

export const inputGroup = ({ name, type, id, label }) => {
    return createElement('div', {
        classList: ['form-group'],
        children: [
            label &&
                createElement('label', {
                    for: id || name,
                    text: label,
                }),
            createElement('input', {
                id: id || name,
                name,
                type,
            }),
            createElement('span', {
                classList: ['form-group__error'],
            }),
        ],
    });
};
