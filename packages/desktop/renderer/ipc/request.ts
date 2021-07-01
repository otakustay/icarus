import {ipcRenderer} from 'electron';
import * as R from 'ramda';
import {parse, Key} from 'path-to-regexp';

const requestBase = async (method: 'GET' | 'POST', url: string, params: unknown, body: unknown) => {
    return ipcRenderer.invoke(`${method} ${url}`, params, body);
};

const isKeyToken = (token: string | Key): token is Key => typeof token !== 'string';

const isString = (value: number | string): value is string => typeof value === 'string';

interface Options<I> {
    processInput?: (input: I) => any;
}

export const createInterface = <I, O>(method: 'GET' | 'POST', url: string, options: Options<I> = {}) => {
    const {processInput = R.identity} = options;
    const tokens = parse(url);
    const paramNames = new Set(tokens.filter(isKeyToken).map(v => v.name).filter(isString));

    const request = async (paramsAndBody: I) => {
        const input = processInput(paramsAndBody);
        const [params, body] = Object.entries(input ?? {}).reduce(
            ([params, body], [key, value]) => {
                if (paramNames.has(key)) {
                    params[key] = value;
                }
                else {
                    body[key] = value;
                }
                return [params, body];
            },
            [{}, {}] as [Record<string, unknown>, Record<string, unknown>]
        );
        const result = await requestBase(method, url, params, body);
        return result as O;
    };
    return request;
};
