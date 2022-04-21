import axios from 'axios';

export const selfPing = ({ interval = 900000, path = '/ping' }) => {
    setInterval(() => {
        axios.get(process.env.BASE_URL + path);
    }, interval);
};
