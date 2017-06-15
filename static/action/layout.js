import {CONTAINER_SIZE_CHANGE, CHANGE_LAYOUT} from './type';
import {isReading} from '../selector';

export let containerSizeChange = size => ({type: CONTAINER_SIZE_CHANGE, ...size});

export let changeLayout = layoutType => (dispatch, getState) => {
    let state = getState();

    if (!isReading(state)) {
        return;
    }

    if (state.layout.type === layoutType) {
        return;
    }

    dispatch({type: CHANGE_LAYOUT, layout: layoutType});
};

export let topBottomLayout = () => changeLayout('topBottom');

export let oneStepLayout = () => changeLayout('oneStep');
