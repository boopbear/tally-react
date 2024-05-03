/**
 * The function `client` is an asynchronous function that sends HTTP requests with configurable options
 * and returns the response data or rejects with an error.
 * @param {string} endpoint - The `endpoint` parameter is a string representing the URL endpoint to
 * which the HTTP request will be made.
 * @param {Config}  - - `endpoint`: The API endpoint URL to make the request to.
 * @returns The `client` function returns a Promise that resolves to the data fetched from the
 * specified endpoint. If the response from the fetch operation is successful (status code in the range
 * 200-299), the function returns the parsed JSON data. If the response is not successful, it returns a
 * rejected Promise with the data received from the server.
 */
interface Config {
    method?: 'POST' | 'GET';
    body?: any;
    headers?: any;
    credentials?: any;
    autoSetHeader?: boolean
}

export const client = async <T>(
    endpoint: string,
    { body, method, headers, autoSetHeader = false }: Config = {}
) => {
    const default_header = { 'content-type': 'application/json' };
    const config: Config = {
        method: body ? 'POST' : 'GET',
        credentials: 'include',
    };
    if (method) {
        config.method = method;
    }
    if (body) {
        config.body = body;
    }
    if (!autoSetHeader) {
        config.headers = default_header;
    }
    if (headers) {
        config.headers = headers;
    }

    const completeEndpoint = process.env.REACT_APP_WEB_SERVICE_URL + endpoint;

    const response = await fetch(completeEndpoint, config);
    const data: T = await response.json();
    if (response.ok) {
        return data;
    }
    return Promise.reject(data);
};
