import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from 'prisma';

export const getLoggedInUser = async (req: Request) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return null;
    }

    const payload = jwt.verify(
        token ?? '',
        process.env.TOKEN_SECRET
    ) as JwtPayload;

    const user = await prisma.user.findFirst({
        where: { id: payload.userId },
    });

    return user;
};
