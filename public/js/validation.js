// @ts-check
export const validateUrl = (string) => {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

export const validateName = (string) => /^[A-z0-9-._]+$/.test(string);

export const errors = {
    name_taken: 'Name is already taken!',
    name_invalid: 'Invalid name! (A-z0-9-_.)',
    url_invalid: 'Invalid URL!',
    url_required: 'URL is required!',
    unknown: 'Something bad happened. Please try again later!',
};