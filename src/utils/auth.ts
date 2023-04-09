import { Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { URLSearchParams } from 'url';
import prisma, { User } from 'prisma';

export const COOKIE_NAME = 'jid';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const GITHUB_USER_URL = 'https://api.github.com/user';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';

const getRedirectUri = (provider: string) =>
    `${process.env.BASE_URL}/api/auth/callback/${provider}`;

export const createAccessToken = (user: User) => {
    return jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '1h',
        }
    );
};

export const createRefreshToken = (user: User) => {
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

export const getGoogleAccessToken = async (code: string): Promise<string> => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: getRedirectUri('google'),
        code,
    });

    const response = await axios.post(GOOGLE_TOKEN_URL, params.toString(), {
        headers: {
            Accept: 'application/x-www-form-urlencoded',
        },
    });

    return response.data.access_token;
};

export interface GoogleData {
    id: string;
    name: string;
    email: string;
}

export const getGoogleUserDetails = async (
    accessToken: string
): Promise<GoogleData> => {
    const response = await axios.get<GoogleData>(GOOGLE_USER_URL, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    });

    return response.data;
};

export const findOrCreategoogleUser = async (data: GoogleData) => {
    const user = await prisma.user.findFirst({
        where: { googleId: data.id },
    });

    if (user) {
        return user;
    }

    const newUser = await prisma.user.create({
        data: {
            googleId: data.id,
            name: data.name,
            email: data.email,
        },
    });

    return newUser;
};

export const getGithubAccessToken = async (code: string): Promise<string> => {
    const response = await axios.post(
        GITHUB_TOKEN_URL,
        {},
        {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                Accept: 'application/json',
            },
        }
    );

    return response.data.access_token;
};

interface GithubData {
    id: number;
    login: string;
    email?: string;
}

export const getGithubUserDetails = async (accessToken: string) => {
    const response = await axios.get<GithubData>(GITHUB_USER_URL, {
        headers: {
            Authorization: 'token ' + accessToken,
        },
    });

    return response.data;
};

export const findOrCreateGithubUser = async (data: GithubData) => {
    const user = await prisma.user.findFirst({
        where: { githubId: data.id },
    });

    if (user) {
        return user;
    }

    const newUser = await prisma.user.create({
        data: {
            githubId: data.id,
            name: data.login,
            email: data?.email,
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
