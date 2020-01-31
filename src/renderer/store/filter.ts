import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {updateFilter} from '../actions/app';

interface State {
    tags: string[];
}

export default createReducer<State>(
    {tags: []},
    {
        [updateFilter.type](state, action: PayloadAction<string[]>) {
            state.tags = action.payload;
        },
    }
);
