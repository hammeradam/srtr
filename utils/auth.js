import jwt from 'jsonwebtoken';

export const createAccessToken = (user) => {
    return jwt.sign({ userId: user._id, email: user.email }, process.env.TOKEN_SECRET, {
        expiresIn: '15m'
    });
};

export const createRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id, tokenVersion: user.tokenVersion },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '7d'
        }
    );
};

export const sendRefreshToken = (res, token) => {
    res.cookie('jid', token, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        secure: false
    });
};