import moment from 'moment';
import {isReading} from '../selectors';
import {showAlert} from './notice';

export const TOGGLE_HELP = 'TOGGLE_HELP';
export const TOGGLE_FULLSCREEN = 'TOGGLE_FULLSCREEN';
export const TOGGLE_DISTURB_MODE = 'TOGGLE_DISTURB_MODE';
export const TOGGLE_TIMING = 'TOGGLE_TIMING';
export const TOGGLE_INFO = 'TOGGLE_INFO';
export const TOGGLE_TAG_LIST = 'TOGGLE_TAG_LIST';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';

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
