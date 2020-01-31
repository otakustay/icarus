import electron from 'electron';
import {createAction} from '@reduxjs/toolkit';
import {ClientTagInfo} from '../../interface';
import {Dispatch} from './dispatch';

const ipc = electron.ipcRenderer;

export interface TagRequest {
    archive: string;
    tag: string;
}

export const addTag = createAction<string, 'ADD_TAG'>('ADD_TAG');

export const removeTag = createAction<string, 'REMOVE_TAG'>('REMOVE_TAG');

export const addTagToArchive = (archive: string, tag: string) => (dispatch: Dispatch) => {
    ipc.send('add-tag', {archive, tag});
    dispatch(addTag(tag));
};

export const removeTagFromArchive = (archive: string, tag: string) => (dispatch: Dispatch) => {
    ipc.send('remove-tag', {archive, tag});
    dispatch(removeTag(tag));
};

export const updateTags = createAction<ClientTagInfo[], 'UPDATE_TAGS'>('UPDATE_TAGS');
