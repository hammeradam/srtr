export const getRedirectUri = (provider: string) =>
    `${process.env.BASE_URL}/api/auth/callback/${provider}`;
