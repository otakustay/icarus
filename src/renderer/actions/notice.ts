import {createAction} from '@reduxjs/toolkit';

export const showLoading = createAction('SHOW_LOADING');

export const hideLoading = createAction('HIDE_LOADING');

export interface ShowMessagePayload {
    title: string;
    content: string;
}

export const showMessage = createAction<ShowMessagePayload>('SHOW_MESSAGE');

export const hideMessage = createAction('HIDE_MESSAGE');

export const noMore = createAction('NO_MORE');

export const noState = createAction('NO_STATE');

export const serviceError = createAction<string>('SERVICE_ERROR');

export interface TimingPayload {
    minutes: number;
    seconds: number;
}

export const endTiming = createAction<TimingPayload>('END_TIMING');
