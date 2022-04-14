import { sendRequest } from './request.js';
import { errors, name, required, createFormValidator } from './validation.js';

const nameInput = document.querySelector('.check-container input[name="name"]');
const checkError = document.querySelector('.check-container .error');
const checkSuccess = document.querySelector('.check-container .success');
const checkNameError = document.querySelector('.check-container .name-error');

const checkForm = document.querySelector('#check-form');
const checkFormInputs = [
    {
        element: nameInput,
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
const validateCheckForm = createFormValidator(checkFormInputs);

checkForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateCheckForm()) {
        return;
    }

    checkError.classList.add('d-none');
    checkSuccess.classList.add('d-none');

    const response = await sendRequest(`/api/url/${nameInput.value}`);

    if (!response.ok) {
        if (response.status === 404) {
            checkError.classList.remove('d-none');
            return;
        }
        const { error } = await response.json();
        checkNameError.textContent = errors[error];
        checkNameError.classList.add('show');
    }

    const { link } = await response.json();

    checkSuccess.classList.remove('d-none');
    checkSuccess.querySelector('span').textContent = link.hitCount;
    checkSuccess.querySelector('a').href = link.url;
    checkSuccess.querySelector('a').textContent = link.url;
});
