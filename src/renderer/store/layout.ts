import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {changeLayout} from '../actions/layout';
import {LayoutType} from '../../interface';

export default createReducer(
    {
        type: 'adaptive' as LayoutType,
    },
    {
        [changeLayout.type](state, action: PayloadAction<LayoutType>) {
            state.type = action.payload;
        },
    }
);
