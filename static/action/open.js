import electron from 'electron';
import {showLoading} from './notice';

let ipc = electron.ipcRenderer;

export let open = file => dispatch => {
    dispatch(showLoading());

    ipc.send('open', file);
};

export let openMultiple = files => dispatch => {
    dispatch(showLoading());

    ipc.send('open-multiple', files);
};

export let restoreState = () => dispatch => {
    dispatch(showLoading());

    ipc.send('restore');
};
