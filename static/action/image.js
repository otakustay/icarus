import electron from 'electron';
import {isReading} from '../selector';
import {NEW_IMAGE} from './type';
import {showLoading, hideLoading} from './notice';

const ipc = electron.ipcRenderer;

export const newImage = info => dispatch => {
    dispatch(hideLoading());
    dispatch({type: NEW_IMAGE, ...info});
};

export const nextImage = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch(showLoading());

    ipc.send('next-image');
};

export const previousImage = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch(showLoading());

    ipc.send('previous-image');
};
