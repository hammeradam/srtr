import { Response } from 'express';
import path from 'path';

export const sendHtml = (res: Response, page: string) => {
    return res.sendFile(
        path.resolve(path.join(__dirname, `../pages/${page}.html`))
    );
};
