import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { URLSearchParams } from 'url';
import prisma from 'prisma';

export const COOKIE_NAME = 'jid';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const GITHUB_USER_URL = 'https://api.github.com/user';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';

const getRedirectUri = (provider: string) =>
    `${process.env.BASE_URL}/api/auth/callback/${provider}`;

export const createAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '1h',
        }
    );
};

export const createRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id, tokenVersion: user.tokenVersion },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '7d',
        }
    );
};

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        secure: false,
    });
};

export const clearRefreshToken = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        secure: false,
    });
};

export const getGoogleAccessToken = async (code: string) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: getRedirectUri('google'),
        code,
    });

    const request = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/x-www-form-urlencoded',
        },
        body: params,
    });

    const response = await request.json();

    return response.access_token;
};

export const getGoogleUserDetails = async (accessToken: string) => {
    const request = await fetch(GOOGLE_USER_URL, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    });

    const response = await request.json();

    return response;
};

export const findOrCreategoogleUser = async (googleData: any) => {
    if (!googleData?.id) {
        return null;
    }

    const user = await prisma.user.findFirst({
        where: { googleId: googleData.id },
    });

    if (user) {
        return user;
    }

    const newUser = await prisma.user.create({
        data: {
            googleId: googleData.id,
            name: googleData.name,
            email: googleData.email,
        },
    });

    return newUser;
};

export const getGithubAccessToken = async (code: string) => {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
    }).toString();

    const request = await fetch(GITHUB_TOKEN_URL + '?' + params, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
    });

    const response = await request.json();

    return response;
};

export const getGithubUserDetails = async (accessToken: string) => {
    const request = await fetch(GITHUB_USER_URL, {
        headers: {
            Authorization: 'token ' + accessToken,
        },
    });

    const response = await request.json();

    return response;
};

export const findOrCreateGithubUser = async (githubData: any) => {
    const user = await prisma.user.findFirst({
        where: { githubId: githubData.id },
    });

    if (user) {
        return user;
    }

    const newUser = await prisma.user.create({
        data: {
            githubId: githubData.id,
            name: githubData.login,
            email: githubData?.email,
        },
    });

    return newUser;
};

export const findOrCreateByEmail = async (email: string) => {
    const user = await prisma.user.findFirst({ where: { email } });

    if (user) {
        return user;
    }

    const newUser = await prisma.user.create({
        data: {
            email,
        },
    });

    return newUser;
};
