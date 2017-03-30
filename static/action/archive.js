import electron from 'electron';
import {NEW_ARCHIVE} from './type';
import {showLoading} from './notice';
import {isReading} from '../selector';

let ipc = electron.ipcRenderer;

export let newArchive = info => ({type: NEW_ARCHIVE, ...info});

export let nextArchive = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch(showLoading());

    ipc.send('next-archive');
};

export let previousArchive = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch(showLoading());

    ipc.send('previous-archive');
};
