import axios from 'axios';
import prisma from 'prisma';

export const selfPing = (interval = 900000, path = '/ping') => {
    setInterval(async () => {
        await prisma.link.count();
        axios.get(process.env.BASE_URL + path);
    }, interval);
};
