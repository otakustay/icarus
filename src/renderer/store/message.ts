import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {
    showMessage,
    hideMessage,
    noMore,
    Direction,
    noState,
    serviceError,
    endTiming,
    ShowMessagePayload,
    TimingPayload,
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
        [endTiming.type](state, action: PayloadAction<TimingPayload>) {
            const {minutes, seconds} = action.payload;
            state.visible = true;
            state.title = '计时：' + (minutes ? `${minutes}分${seconds}秒` : `${seconds}秒`);
            state.content = '';
        },
    }
);
