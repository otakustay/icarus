import electron from 'electron';

const ipc = electron.ipcRenderer;

export const ADD_TAG = 'ADD_TAG';
export const REMOVE_TAG = 'REMOVE_TAG';
export const UPDATE_TAGS = 'UPDATE_TAGS';

export const addTag = tag => (dispatch, getState) => {
    const archive = getState().archive.name;
    ipc.send('add-tag', {archive, tag});

    dispatch({type: ADD_TAG, tag: tag});
};

export const removeTag = tag => (dispatch, getState) => {
    const archive = getState().archive.name;
    ipc.send('remove-tag', {archive, tag});

    dispatch({type: REMOVE_TAG, tag: tag});
};

export const updateTags = info => ({type: UPDATE_TAGS, ...info});
