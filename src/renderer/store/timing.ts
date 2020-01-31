import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {startTiming, endTiming} from '../actions/panel';

export default createReducer(
    {begin: 0},
    {
        [startTiming.type](state, action: PayloadAction<number>) {
            state.begin = action.payload;
        },
        [endTiming.type](state) {
            state.begin = 0;
        },
    }
);
