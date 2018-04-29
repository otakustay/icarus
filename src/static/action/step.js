import electron from 'electron';
import {isReading} from '../selector';
import {NEXT_STEP, PREVIOUS_STEP} from './type';
import {showLoading} from './notice';

const ipc = electron.ipcRenderer;

export const nextStep = () => (dispatch, getState) => {
    const state = getState();

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

export const previousStep = () => (dispatch, getState) => {
    const state = getState();

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
