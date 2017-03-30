import electron from 'electron';
import {NEXT_STEP, PREVIOUS_STEP} from './type';
import {showLoading} from './notice';
import {isReading} from '../selector';

let ipc = electron.ipcRenderer;

export let nextStep = () => (dispatch, getState) => {
    let state = getState();

    if (!isReading(state)) {
        return;
    }

    if (state.layout.stepIndex < state.layout.steps.length - 1) {
        dispatch({type: NEXT_STEP});
    }
    else {
        dispatch(showLoading());
        ipc.send('next-image');
    }
};

export let previousStep = () => (dispatch, getState) => {
    let state = getState();

    if (!isReading(state)) {
        return;
    }

    if (state.layout.stepIndex > 0) {
        dispatch({type: PREVIOUS_STEP});
    }
    else {
        dispatch(showLoading());
        ipc.send('previous-image');
    }
};
