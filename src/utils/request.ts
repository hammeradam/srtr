export async function get<T>(
    url: string,
    {
        headers,
    }: {
        headers?: HeadersInit;
    }
) {
    const response = await fetch(url, {
        headers,
    });

    return response.json() as T;
}

export async function post<T>(
    url: string,
    {
        headers,
        body,
        params,
    }: {
        headers?: HeadersInit;
        body?: any;
        params?: Record<string, string>;
    }
) {
    const response = await fetch(
        url + '?' + new URLSearchParams(params).toString(),
        {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
        console.log(response);
        throw new Error('ASD');
    }

    return response.json() as T;
}
