import { createElement } from '../utils/createElement.js';
import { getQueryParam } from '../utils/getQueryParam.js';

const errorMapping = {
    401: 'unauthorized',
    403: 'forbidden',
    404: 'not found',
    500: 'internal server error',
    418: "i'm a teapot",
};

const getErrorText = (code) => {
    return errorMapping[code] || 'something went wrong';
};

export const error = () => {
    const code = getQueryParam('code');

    return createElement('div', {
        classList: ['error-page'],
        children: [
            createElement('h1', {
                text: code || 'error',
            }),
            createElement('p', {
                text: getErrorText(code),
            }),
        ],
    });
};
