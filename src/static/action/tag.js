import electron from 'electron';
import {ADD_TAG, REMOVE_TAG, UPDATE_TAGS} from './type';

const ipc = electron.ipcRenderer;

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
