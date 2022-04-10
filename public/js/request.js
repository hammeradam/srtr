export const sendRequest = (path, options) => {
    return fetch(path, {
        credentials: 'include',
        ...options,
        headers: {
            ...options?.headers,
            authorization: 'Bearer: ' + window.accessToken,
        },
    });
};
