import electron from 'electron';
import {isReading} from '../selectors';
import {showLoading} from './notice';

const ipc = electron.ipcRenderer;

export const NEW_ARCHIVE = 'NEW_ARCHIVE';

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
