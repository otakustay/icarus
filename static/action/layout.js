import {CONTAINER_SIZE_CHANGE, CHANGE_LAYOUT} from './type';

export let containerSizeChange = size => ({type: CONTAINER_SIZE_CHANGE, ...size});

export let changeLayout = layoutType => (dispatch, getState) => {
    let {image, layout} = getState();

    if (!image.uri) {
        return;
    }

    if (layout.type === layoutType) {
        return;
    }

    dispatch({type: CHANGE_LAYOUT, layout: layoutType});
};
