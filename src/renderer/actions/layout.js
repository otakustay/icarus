import {isReading} from '../selectors';

export const CONTAINER_SIZE_CHANGE = 'CONTAINER_SIZE_CHANGE';
export const CHANGE_LAYOUT = 'CHANGE_LAYOUT';

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
