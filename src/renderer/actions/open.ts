import electron from 'electron';
import {createAction} from '@reduxjs/toolkit';
import {Dispatch} from './dispatch';

const ipc = electron.ipcRenderer;

export const opening = createAction('OPENING');

export const open = (file: string) => (dispatch: Dispatch) => {
    dispatch(opening());
    ipc.send('open', file);
};

export const openMultiple = (files: string[]) => (dispatch: Dispatch) => {
    dispatch(opening());
    ipc.send('open-multiple', files);
};

export const restoreState = () => (dispatch: Dispatch) => {
    dispatch(opening());
    ipc.send('restore');
};
