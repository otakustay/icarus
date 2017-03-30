import electron from 'electron';
import {NEW_IMAGE} from './type';
import {hideLoading} from './notice';

let ipc = electron.ipcRenderer;

export let newImage = info => dispatch => {
    dispatch(hideLoading());
    dispatch({type: NEW_IMAGE, ...info});
};

export let nextImage = () => (dispatch, getState) => {
    if (!getState().image.uri) {
        return;
    }

    ipc.send('next-image');
};

export let previousImage = () => (dispatch, getState) => {
    if (!getState().image.uri) {
        return;
    }

    ipc.send('previous-image');
};
