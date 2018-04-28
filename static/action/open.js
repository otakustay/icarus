import electron from 'electron';
import {showLoading} from './notice';

const ipc = electron.ipcRenderer;

export const open = file => dispatch => {
    dispatch(showLoading());

    ipc.send('open', file);
};

export const openMultiple = files => dispatch => {
    dispatch(showLoading());

    ipc.send('open-multiple', files);
};

export const restoreState = () => dispatch => {
    dispatch(showLoading());

    ipc.send('restore');
};
