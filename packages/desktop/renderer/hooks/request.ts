/* eslint-disable no-redeclare */
import {useOriginalDeepCopy} from '@huse/previous-value';
import {useCallback, useEffect, useMemo} from 'react';
import {useTakeLatest} from './takeLatest';

type Async<I, O> = (params: I) => Promise<O>;

export interface OptionsDefaultThrow<T> {
    defaultValue: T;
    throwError: true;
}

export interface OptionsDefaultNoThrow<T> {
    defaultValue: T;
    throwError?: false;
}

export interface OptionsNoDefaultThrow {
    throwError: true;
}

export interface OptionsNoDefaultNoThrow {
    throwError?: false;
}

export interface PendingDefault<T> {
    state: 'pending';
    data: T;
}

export interface PendingNoDefault {
    state: 'pending';
}

export interface HasValue<T> {
    state: 'hasValue';
    data: T;
}

export interface HasError {
    state: 'hasError';
    error: Error;
}

export type HasDefaultThrow<T> = PendingDefault<T> | HasValue<T>;

export type NoDefaultThrow<T> = PendingNoDefault | HasValue<T>;

export type HasDefaultNoThrow<T> = PendingDefault<T> | HasValue<T> | HasError;

export type NoDefaultNoThrow<T> = PendingNoDefault | HasValue<T> | HasError;

type CallbackHook<S> = [() => Promise<void>, S];

function useRequestCallback<I, O>(
    api: Async<I, O>,
    params: I,
    options: OptionsDefaultThrow<O>
): CallbackHook<HasDefaultThrow<O>>;
function useRequestCallback<I, O>(
    api: Async<I, O>,
    params: I,
    options: OptionsNoDefaultThrow
): CallbackHook<NoDefaultThrow<O>>;
function useRequestCallback<I, O>(
    api: Async<I, O>,
    params: I,
    options: OptionsDefaultNoThrow<O>
): CallbackHook<HasDefaultNoThrow<O>>;
function useRequestCallback<I, O>(
    api: Async<I, O>,
    params: I,
    options?: OptionsNoDefaultNoThrow
): CallbackHook<NoDefaultNoThrow<O>>;
function useRequestCallback<I, O>(api: Async<I, O>, params: I, options: any) {
    const [state, wrapped] = useTakeLatest(api);
    const key = useOriginalDeepCopy(params);
    const callback = useCallback(
        () => wrapped(key),
        [wrapped, key]
    );
    const responseState = useMemo(
        () => {
            switch (state.state) {
                case 'pending':
                    return options.defaultValue ? {state: 'pending', data: options.defaultValue} : state;
                case 'hasValue':
                    return state;
                case 'hasError': {
                    if (options.throwError) {
                        throw state.error;
                    }
                    return state;
                }
            }
        },
        [options.defaultValue, options.throwError, state]
    );

    return [callback, responseState];
}

function useRequest<I, O>(api: Async<I, O>, params: I, options: OptionsDefaultThrow<O>): HasDefaultThrow<O>;
function useRequest<I, O>(api: Async<I, O>, params: I, options: OptionsNoDefaultThrow): NoDefaultThrow<O>;
function useRequest<I, O>(api: Async<I, O>, params: I, options: OptionsDefaultNoThrow<O>): HasDefaultNoThrow<O>;
function useRequest<I, O>(api: Async<I, O>, params: I, options?: OptionsNoDefaultNoThrow): NoDefaultNoThrow<O>;
function useRequest<I, O>(api: Async<I, O>, params: I, options: any) {
    const [callback, state] = useRequestCallback(api, params, options);
    useEffect(
        () => {
            callback();
        },
        [callback]
    );

    return state;
}

export {useRequestCallback, useRequest};
