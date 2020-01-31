import electron from 'electron';
import {createAction} from '@reduxjs/toolkit';
import {ClientArchiveInfo} from '../../interface';
import {Dispatch} from './dispatch';

const ipc = electron.ipcRenderer;

export const receiveArchive = createAction<ClientArchiveInfo>('RECEIVE_ARCHIVE');

export const requestNextArchive = createAction('NEXT_ARCHIVE');

export const requestPreviousArchive = createAction('PREVIOUS_ARCHIVE');

export const nextArchive = () => (dispatch: Dispatch) => {
    dispatch(requestNextArchive());
    ipc.send('next-archive');
};

export const previousArchive = () => (dispatch: Dispatch) => {
    dispatch(requestPreviousArchive());
    ipc.send('previous-archive');
};
