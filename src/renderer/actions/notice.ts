import {createAction} from '@reduxjs/toolkit';
import {Dispatch} from './dispatch';

export const showLoading = createAction('SHOW_LOADING');

export const hideLoading = createAction('HIDE_LOADING');

export interface ShowMessagePayload {
    title: string;
    content: string;
}

export const showMessage = createAction<ShowMessagePayload>('SHOW_MESSAGE');

export const hideMessage = createAction('HIDE_MESSAGE');

// TODO: 干掉，计时移进组件
export const showAlert = (title: string, content: string = '') => (dispatch: Dispatch) => {
    dispatch(showMessage({title, content}));
};

export type Direction = 'forward' | 'backward';

export const noMore = createAction<Direction>('NO_MORE');

export const noState = createAction('NO_STATE');

export const serviceError = createAction<string>('SERVICE_ERROR');
