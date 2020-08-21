import electron from 'electron';
import {createAction} from '@reduxjs/toolkit';
import {ClientArchiveInfo} from '../../interface';
import {Dispatch, GetState} from './dispatch';

const ipc = electron.ipcRenderer;

export const requestArchive = createAction('REQUEST_ARCHIVE');

export const receiveArchive = createAction<ClientArchiveInfo>('RECEIVE_ARCHIVE');

export const nextArchive = () => (dispatch: Dispatch, getState: GetState) => {
    dispatch(requestArchive());
    ipc.send('move-to-archive', {index: getState().archive.index + 1, moveToLast: false});
};

export const previousArchive = () => (dispatch: Dispatch, getState: GetState) => {
    dispatch(requestArchive());
    ipc.send('move-to-archive', {index: getState().archive.index - 1, moveToLast: false});
};

export const moveArchive = (index: number) => (dispatch: Dispatch) => {
    dispatch(requestArchive());
    ipc.send('move-to-archive', {index, moveToLast: false});
};
