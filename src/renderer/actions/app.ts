import electron from 'electron';
import {createAction} from '@reduxjs/toolkit';
import {TagState} from '../../interface';
import {Dispatch} from './dispatch';

const ipc = electron.ipcRenderer;

export const init = createAction<TagState>('INIT');

export const updateFilter = createAction<string[], 'UPDATE_FILTER'>('UPDATE_FILTER');

export const confirmFilter = createAction('CONFIRM_FILTER');

export const filterArchives = (tags: string[]) => (dispatch: Dispatch) => {
    dispatch(confirmFilter());
    ipc.send('filter', tags);
};
