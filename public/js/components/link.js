import { createElement } from '../utils/createElement.js';
import { sendRequest } from '../utils/sendRequest.js';
import { navigateTo } from './router.js';
import { table } from './table.js';

export const link = async ({ name }) => {
    if (!name) {
        navigateTo('error', { code: 404 });
        return null;
    }

    const detailsResponse = await sendRequest(`/api/url/${name}`);

    if (!detailsResponse.ok) {
        navigateTo('error', { code: detailsResponse?.status || 404 });
        return null;
    }

    const { link } = await detailsResponse.json();

    return createElement('div', {
        classList: ['card'],
        children: [
            createElement('h1', {
                style: 'white-space: nowrap;',
                text: 'link',
            }),
            createElement('div', {
                classList: ['link__details'],
                children: [
                    createElement('p', {
                        text: `name: ${link.name}`,
                    }),
                    createElement('a', {
                        text: link.url,
                        href: link.url,
                        target: '_blank',
                    }),
                    createElement('p', {
                        text: `${link.hitCount} clicks`,
                    }),
                ],
            }),
            await table({
                resourcePath: `/api/url/${name}/analytics`,
                hasPagination: true,
                id: 'analyticsTable',
                columns: [
                    {
                        header: 'date',
                        accessor: 'createdAt',
                        render: (value) => new Date(value).toLocaleString(),
                    },
                    {
                        header: 'ip',
                        accessor: 'ip',
                        render: (value) => value,
                    },
                    {
                        header: 'os',
                        accessor: 'os',
                        render: (value) => value,
                    },
                    {
                        header: 'browser',
                        accessor: 'browser',
                        render: (value) => value,
                    },
                    {
                        header: 'device',
                        accessor: 'device',
                        render: (value) => value.device || '-',
                    },
                ],
            }),
        ],
    });
};
