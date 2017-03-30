import electron from 'electron';
import {NEW_IMAGE} from './type';
import {showLoading, hideLoading} from './notice';
import {isReading} from '../selector';

let ipc = electron.ipcRenderer;

export let newImage = info => dispatch => {
    dispatch(hideLoading());
    dispatch({type: NEW_IMAGE, ...info});
};

export let nextImage = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch(showLoading());

    ipc.send('next-image');
};

export let previousImage = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch(showLoading());

    ipc.send('previous-image');
};
