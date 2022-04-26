import { Request } from 'express';

export interface PaginationOptions {
    skip?: number;
    take?: number;
}

export const getPaginationParams = (req: Request): PaginationOptions => {
    const { page, pageSize = 20 } = req.query;
    const paginationOptions: PaginationOptions = {};

    if (typeof pageSize !== 'string' && typeof pageSize !== 'number') {
        throw new Error('invalid_pageSize');
    }

    if (typeof page === 'string') {
        const pageNumber = parseInt(page);
        paginationOptions.take = parseInt(pageSize as string);
        paginationOptions.skip = pageNumber * paginationOptions.take;
    }

    console.log({ paginationOptions });

    return paginationOptions;
};
