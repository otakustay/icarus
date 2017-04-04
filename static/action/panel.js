import moment from 'moment';
import {
    TOGGLE_HELP,
    TOGGLE_FULLSCREEN,
    TOGGLE_DISTURB_MODE,
    TOGGLE_TIMING,
    TOGGLE_INFO,
    TOGGLE_TAG_LIST,
    TOGGLE_FILTER
} from './type';
import {showAlert} from './notice';
import {isReading} from '../selector';

export let toggleHelp = () => ({type: TOGGLE_HELP});

export let toggleFullscreen = () => ({type: TOGGLE_FULLSCREEN});

export let toggleDisturbMode = () => ({type: TOGGLE_DISTURB_MODE});

export let toggleTiming = () => (dispatch, getState) => {
    let timingBegin = getState().timingBegin;

    if (timingBegin) {
        let now = moment();
        let totalSeconds = now.diff(timingBegin, 'seconds');
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        dispatch(showAlert('计时：' + (minutes ? `${minutes}分${seconds}秒` : `${seconds}秒`)));
    }

    dispatch({type: TOGGLE_TIMING});
};

export let toggleInfo = () => ({type: TOGGLE_INFO});

export let toggleTagList = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch({type: TOGGLE_TAG_LIST});
};

export let toggleFilter = () => (dispatch, getState) => {
    if (!isReading(getState())) {
        return;
    }

    dispatch({type: TOGGLE_FILTER});
};
