import electron from 'electron';
import {NEXT_STEP, PREVIOUS_STEP} from './type';
import {showLoading} from './notice';

let ipc = electron.ipcRenderer;

export let nextStep = () => (dispatch, getState) => {
    let {layout: {steps, stepIndex}, image} = getState();

    if (!image.uri) {
        return;
    }

    if (stepIndex < steps.length - 1) {
        dispatch({type: NEXT_STEP});
    }
    else {
        dispatch(showLoading());
        ipc.send('next-image');
    }
};

export let previousStep = () => (dispatch, getState) => {
    let {layout: {stepIndex}, image} = getState();

    if (!image.uri) {
        return;
    }

    if (stepIndex > 0) {
        dispatch({type: PREVIOUS_STEP});
    }
    else {
        dispatch(showLoading());
        ipc.send('previous-image');
    }
};
