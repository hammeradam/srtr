import { Response } from 'express';
import path from 'path';

export const sendHtml = (res: Response, page: string, status?: number) => {
    if (status != null) {
        res.status(status);
    }

    return res.sendFile(path.join(__dirname, `../pages/${page}.html`));
};
