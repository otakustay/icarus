import moment from 'moment';
import {isReading} from '../selector';
import {
    TOGGLE_HELP,
    TOGGLE_FULLSCREEN,
    TOGGLE_DISTURB_MODE,
    TOGGLE_TIMING,
    TOGGLE_INFO,
    TOGGLE_TAG_LIST,
    TOGGLE_FILTER,
} from './type';
import {showAlert} from './notice';

export const toggleHelp = () => ({type: TOGGLE_HELP});

export const toggleFullscreen = () => ({type: TOGGLE_FULLSCREEN});

export const toggleDisturbMode = () => ({type: TOGGLE_DISTURB_MODE});

export const toggleTiming = () => (dispatch, getState) => {
    const timingBegin = getState().timingBegin;

    if (timingBegin) {
        const now = moment();
        const totalSeconds = now.diff(timingBegin, 'seconds');
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        dispatch(showAlert('计时：' + (minutes ? `${minutes}分${seconds}秒` : `${seconds}秒`)));
    }

    dispatch({type: TOGGLE_TIMING});
};

export const toggleInfo = () => ({type: TOGGLE_INFO});

export const toggleTagList = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch({type: TOGGLE_TAG_LIST});
};

export const toggleFilter = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch({type: TOGGLE_FILTER});
};
