import { Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from 'models';

export const COOKIE_NAME = 'jid';
export const GITHUB_URL = 'https://github.com/login/oauth/access_token';

export const createAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '1s',
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

export const getGithubAccessToken = async (code: string): Promise<string> => {
    const response = await axios.post(
        GITHUB_URL,
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
    const response = await axios.get('https://api.github.com/user', {
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
    });

    return newUser;
};
