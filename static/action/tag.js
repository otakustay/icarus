import electron from 'electron';
import {ADD_TAG, REMOVE_TAG, UPDATE_TAGS} from './type';

let ipc = electron.ipcRenderer;

export let addTag = tag => (dispatch, getState) => {
    let archive = getState().archive.name;
    ipc.send('add-tag', {archive, tag});

    dispatch({type: ADD_TAG, tag: tag});
};

export let removeTag = tag => (dispatch, getState) => {
    let archive = getState().archive.name;
    ipc.send('remove-tag', {archive, tag});

    dispatch({type: REMOVE_TAG, tag: tag});
};

export let updateTags = info => ({type: UPDATE_TAGS, ...info});
