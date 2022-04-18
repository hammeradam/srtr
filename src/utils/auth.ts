import { Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from 'models';
import { URLSearchParams } from 'url';

export const COOKIE_NAME = 'jid';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const GITHUB_USER_URL = 'https://api.github.com/user';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';

const getRedirectUri = (provider: string) =>
    `${process.env.BASE_URL}/api/auth/callback/${provider}`;

export const createAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '1h',
        }
    );
};

export const createRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id, tokenVersion: user.tokenVersion },
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
    try {
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
    } catch (error) {
        // @ts-ignore
        console.log(error.response);
    }
};

export const getGoogleUserDetails = async (accessToken: string) => {
    try {
        const response = await axios.get(GOOGLE_USER_URL, {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });

        return response.data;
    } catch (error) {
        // @ts-ignore
        console.log(error.response);
    }
};

export const findOrCreategoogleUser = async (googleData: any) => {
    if (!googleData?.id) {
        return null;
    }

    const user = await User.findOne({ googleId: googleData.id });

    if (user) {
        return user;
    }

    const newUser = await User.create({
        googleId: googleData.id,
        name: googleData.name,
        email: googleData.email,
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

export const getGithubUserDetails = async (accessToken: string) => {
    const response = await axios.get(GITHUB_USER_URL, {
        headers: {
            Authorization: 'token ' + accessToken,
        },
    });

    return response.data;
};

export const findOrCreateGithubUser = async (githubData: any) => {
    const user = await User.findOne({ githubId: githubData.id });

    if (user) {
        return user;
    }

    const newUser = await User.create({
        githubId: githubData.id,
        name: githubData.login,
        email: githubData?.email,
    });

    return newUser;
};
