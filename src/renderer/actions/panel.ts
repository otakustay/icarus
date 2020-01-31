import {createAction} from '@reduxjs/toolkit';
import {showAlert} from './notice';
import {Dispatch} from './dispatch';

export const toggleHelp = createAction('TOGGLE_HELP');

export const toggleFullscreen = createAction('TOGGLE_FULLSCREEN');

export const toggleDisturbMode = createAction('TOGGLE_DISTURB_MODE');

export const startTiming = createAction('START_TIMING', () => ({payload: Date.now()}));

export const endTiming = createAction('END_TIMING');

export const finishTiming = (begin: number) => (dispatch: Dispatch) => {
    dispatch(endTiming());

    const totalSeconds = (Date.now() - begin) / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    dispatch(showAlert('计时：' + (minutes ? `${minutes}分${seconds}秒` : `${seconds}秒`)));
};

export const toggleInfo = createAction('TOGGLE_INFO');

export const toggleTagList = createAction('TOGGLE_TAG_LIST');

export const toggleFilter = createAction('TOGGLE_FILTER');
