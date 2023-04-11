export const getRedirectUri = (baseUrl: string, provider: string) => {
    const url = new URL(`/api/auth/callback/${provider}`, baseUrl);
    return url.href;
};
