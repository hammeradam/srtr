export const name = (value) => /^[A-z0-9-._]+$/.test(value);
export const required = (value) => !!value.length;
export const equals = (otherElement) => (value) => value === otherElement.value;
export const url = (string) => {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};
export const email = (value) =>
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        value
    );
export const optional = (otherRule) => (value) =>
    value ? otherRule(value) : true;

const validate = ({ name, rules }, form, isFormValid) => {
    const element = form.querySelector(`[name="${name}"]`);
    const result = rules.reduce((isInputValid, { validator, errorMessage }) => {
        if (validator(element.value)) {
            return isInputValid || '';
        }

        return errorMessage;
    }, '');

    if (!result.length) {
        return isFormValid;
    }

    const error = element.parentElement.querySelector('.form-group__error');
    error.innerHTML = result;
    error.classList.add('show');

    return false;
};

export const createFormValidator = (inputs) => {
    // inputs.forEach(({ element, rules }) => {
    //     element.addEventListener('input', () =>
    //         element.parentElement
    //             .querySelector('.form-group__error')
    //             .classList.remove('show')
    //     );

    //     element.addEventListener('blur', () =>
    //         validate({ rules, element }, false)
    //     );
    // });

    return (form) =>
        inputs.reduce(
            (isFormValid, input) => validate(input, form, isFormValid),
            true
        );
};

export const errors = {
    name_taken: 'name is already taken',
    name_invalid: 'invalid name (A-z0-9-_.)',
    name_required: 'name is required',
    url_invalid: 'invalid URL',
    url_required: 'URL is required',
    unknown: 'something bad happened, try again later',
    email_invalid: 'invalid email',
    email_required: 'email is required',
    password_required: 'password is required',
};
