import electron from 'electron';
import {isReading} from '../selector';
import {NEW_ARCHIVE} from './type';
import {showLoading} from './notice';

const ipc = electron.ipcRenderer;

export const newArchive = info => ({type: NEW_ARCHIVE, ...info});

export const nextArchive = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch(showLoading());

    ipc.send('next-archive');
};

export const previousArchive = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch(showLoading());

    ipc.send('previous-archive');
};
