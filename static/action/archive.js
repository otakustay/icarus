import electron from 'electron';
import {NEW_ARCHIVE} from './type';
import {showLoading} from './notice';

let ipc = electron.ipcRenderer;

export let newArchive = info => ({type: NEW_ARCHIVE, ...info});

export let nextArchive = () => (dispatch, getState) => {
    if (!getState().image.uri) {
        return;
    }

    dispatch(showLoading());

    ipc.send('next-archive');
};

export let previousArchive = () => (dispatch, getState) => {
    if (!getState().image.uri) {
        return;
    }

    dispatch(showLoading());

    ipc.send('previous-archive');
};
