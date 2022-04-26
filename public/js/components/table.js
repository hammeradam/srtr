import { createElement } from '../utils/createElement.js';
import { sendRequest } from '../utils/sendRequest.js';
import { navigateTo } from './router.js';

const PAGESIZE = 1;

const renderRows = (data, columns) =>
    data.map((data) =>
        createElement('tr', {
            children: columns.map((column) =>
                createElement('td', {
                    text: column.render(data[column.accessor]),
                })
            ),
        })
    );

const updatePageNumber = async (id, page) => {
    document.querySelector(
        `.${id} .table-pagination-wrapper p`
    ).textContent = `page ${page + 1}`;
};

const removeRows = (id) => {
    document
        .querySelectorAll(`.${id} table tr:not(:first-child)`)
        .forEach((row) => row.remove());
};

const appendRows = (id, rows, columns) => {
    document.querySelector(`.${id} table`).append(...renderRows(rows, columns));
};

const updateTable = (id, page, data, columns) => {
    updatePageNumber(id, page);
    removeRows(id);
    appendRows(id, data, columns);
};

const getData = async (resourcePath, page, pageSize, hasPagination) => {
    const url = hasPagination
        ? `${resourcePath}?page=${page}&pageSize=${pageSize}`
        : resourcePath;
    const response = await sendRequest(url);

    if (!response.ok) {
        navigateTo('error', { code: response?.status || 404 });
        return null;
    }

    return response.json();
};

export const table = async ({
    resourcePath,
    hasPagination = false,
    id,
    pageSize = PAGESIZE,
    columns,
}) => {
    const nextPage = async () => {
        const { data } = await getData(
            resourcePath,
            ++page,
            pageSize,
            hasPagination
        );

        document
            .querySelector(`.${id} .table-pagination-wrapper__prev`)
            .removeAttribute('disabled');

        if (count <= (page + 1) * PAGESIZE) {
            document
                .querySelector(`.${id} .table-pagination-wrapper__next`)
                .setAttribute('disabled', true);
        }

        updateTable(id, page, data, columns);
    };

    const prevPage = async () => {
        const { data } = await getData(
            resourcePath,
            --page,
            pageSize,
            hasPagination
        );

        document
            .querySelector(`.${id} .table-pagination-wrapper__next`)
            .removeAttribute('disabled');

        if (page === 0) {
            document
                .querySelector(`.${id} .table-pagination-wrapper__prev`)
                .setAttribute('disabled', true);
        }

        updateTable(id, page, data, columns);
    };

    let page = 0;

    const { data, count } = await getData(
        resourcePath,
        page,
        pageSize,
        hasPagination
    );

    return createElement('div', {
        classList: [id],
        children: [
            createElement('table', {
                children: [
                    createElement('tr', {
                        children: columns.map((column) =>
                            createElement('th', {
                                text: column.header,
                            })
                        ),
                    }),
                    ...renderRows(data, columns),
                ],
            }),
            hasPagination &&
                createElement('div', {
                    classList: ['table-pagination-wrapper'],
                    children: [
                        createElement('button', {
                            classList: [
                                'btn',
                                'table-pagination-wrapper__prev',
                            ],
                            disabled: 'true',
                            text: '< prev',
                            events: {
                                click: prevPage,
                            },
                        }),
                        createElement('p', {
                            text: `page ${page + 1}`,
                        }),
                        createElement('button', {
                            classList: [
                                'btn',
                                'table-pagination-wrapper__next',
                            ],
                            disabled:
                                count > (page + 1) * PAGESIZE ? null : 'true',
                            text: 'next >',
                            events: {
                                click: nextPage,
                            },
                        }),
                    ],
                }),
        ],
    });
};
