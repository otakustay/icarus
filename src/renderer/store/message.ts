import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {
    showMessage,
    hideMessage,
    noMore,
    ShowMessagePayload,
    Direction,
    noState,
    serviceError,
} from '../actions/notice';

export default createReducer(
    {
        visible: false,
        title: '',
        content: '',
    },
    {
        [showMessage.type](state, action: PayloadAction<ShowMessagePayload>) {
            state.visible = true;
            Object.assign(state, action.payload);
        },
        [hideMessage.type](state) {
            state.visible = false;
        },
        [noMore.type](state, action: PayloadAction<Direction>) {
            state.visible = true;
            state.title = `不能再往${action.payload === 'forward' ? '后' : '前'}翻了`;
            state.content = '';
        },
        [noState.type](state) {
            state.visible = true;
            state.title = '无法找到保存的阅读信息';
            state.content = '';
        },
        [serviceError.type](state, action: PayloadAction<string>) {
            state.visible = true;
            state.title = '应用程序出现异常';
            state.content = action.payload;
        },
    }
);
