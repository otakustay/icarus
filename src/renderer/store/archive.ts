import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {ClientArchiveInfo} from '../../interface';
import {receiveArchive} from '../actions/archive';
import {addTag, removeTag} from '../actions/tag';

const INITIAL: ClientArchiveInfo = {
    total: 0,
    index: 0,
    archive: '',
    tags: [],
};

export default createReducer(
    INITIAL,
    {
        [receiveArchive.type](state, action: PayloadAction<ClientArchiveInfo>) {
            return action.payload;
        },
        [addTag.type](state, action: PayloadAction<string>) {
            state.tags = [...new Set(state.tags).add(action.payload)];
        },
        [removeTag.type](state, action: PayloadAction<string>) {
            state.tags.splice(state.tags.indexOf(action.payload), 1);
        },
    }
);
