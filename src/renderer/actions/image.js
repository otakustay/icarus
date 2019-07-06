import electron from 'electron';
import {isReading} from '../selectors';
import {showLoading, hideLoading} from './notice';

const ipc = electron.ipcRenderer;

export const NEW_IMAGE = 'NEW_IMAGE';

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
