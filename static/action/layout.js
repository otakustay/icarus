import {isReading} from '../selector';
import {CONTAINER_SIZE_CHANGE, CHANGE_LAYOUT} from './type';

export const containerSizeChange = size => ({type: CONTAINER_SIZE_CHANGE, ...size});

export const changeLayout = layoutType => (dispatch, getState) => {
    const state = getState();

    if (!isReading(state)) {
        return;
    }

    if (state.layout.type === layoutType) {
        return;
    }

    dispatch({type: CHANGE_LAYOUT, layout: layoutType});
};

export const topBottomLayout = () => changeLayout('topBottom');

export const oneStepLayout = () => changeLayout('oneStep');
