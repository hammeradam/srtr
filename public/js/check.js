// @ts-check
import { sendRequest } from './request.js';
import { errors, validateName } from './validation.js';

const submitButton = document.querySelector('.check-container button');
const nameInput = document.querySelector('.check-container input[name="name"]');
const checkErrorMessage = document.querySelector('.check-container .error');
const checkSuccess = document.querySelector('.check-container .success');
const checkNameError = document.querySelector('.check-container .name-error');

submitButton.addEventListener('click', async () => {
    checkNameError.classList.remove('show');
    checkErrorMessage.classList.add('d-none');
    checkSuccess.classList.add('d-none');

    if (!validateName(nameInput.value)) {
        checkNameError.textContent = errors.name_invalid;
        checkNameError.classList.add('show');
        return;
    }

    const response = await sendRequest(`/api/url/${nameInput.value}`);

    if (!response.ok) {
        if (response.status === 404) {
            checkErrorMessage.classList.remove('d-none');
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
