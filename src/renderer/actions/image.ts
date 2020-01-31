import electron from 'electron';
import {createAction} from '@reduxjs/toolkit';
import {ClientImageInfo} from '../../interface';
import {Dispatch} from './dispatch';

const ipc = electron.ipcRenderer;

export const receiveImage = createAction<ClientImageInfo>('RECEIVE_IMAGE');

export const requestNextImage = createAction('NEXT_IMAGE');

export const requestPreviousImage = createAction('PREVIOUS_IMAGE');

export const nextImage = () => (dispatch: Dispatch) => {
    dispatch(requestNextImage());
    ipc.send('next-image');
};

export const previousImage = () => (dispatch: Dispatch) => {
    dispatch(requestPreviousImage());
    ipc.send('previous-image');
};
