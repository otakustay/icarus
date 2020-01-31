import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {receiveImage} from '../actions/image';
import {ClientImageInfo} from '../../interface';

export default createReducer<ClientImageInfo>(
    {
        uri: '',
        name: '',
        width: 0,
        height: 0,
    },
    {
        [receiveImage.type](state, action: PayloadAction<ClientImageInfo>) {
            return action.payload;
        },
    }
);
