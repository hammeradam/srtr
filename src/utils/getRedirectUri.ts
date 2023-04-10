export const getRedirectUri = (provider: string) => {
    const url = new URL(`/api/auth/callback/${provider}`, process.env.BASE_URL);
    return url.href;
};
