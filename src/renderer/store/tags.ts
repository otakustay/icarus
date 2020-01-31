import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {updateTags} from '../actions/tag';
import {init} from '../actions/app';
import {ClientTagInfo, TagState} from '../../interface';

const INITIAL: TagState = {
    all: [],
    collisions: {},
};

export default createReducer(
    INITIAL,
    {
        [init.type](state, action: PayloadAction<TagState>) {
            return action.payload;
        },
        [updateTags.type](state, action: PayloadAction<ClientTagInfo[]>) {
            state.all = action.payload;
        },
    }
);
