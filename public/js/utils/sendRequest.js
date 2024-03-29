export const REFRESH_TOKEN_PATH = '/api/auth/refresh_token';

export const sendRequest = async (path, options) => {
    const response = await fetch(path, {
        credentials: 'include',
        ...options,
        headers: {
            ...options?.headers,
            authorization: 'Bearer: ' + window.accessToken,
        },
    });

    if (response.status === 401 && path !== REFRESH_TOKEN_PATH) {
        const tokenRequest = await fetch(REFRESH_TOKEN_PATH, {
            method: 'POST',
        });

        if (tokenRequest.status === 200) {
            const tokenResponse = await tokenRequest.json();
            window.accessToken = tokenResponse.token;

            return fetch(path, {
                credentials: 'include',
                ...options,
                headers: {
                    ...options?.headers,
                    authorization: 'Bearer: ' + window.accessToken,
                },
            });
        }
    }

    return response;
};
