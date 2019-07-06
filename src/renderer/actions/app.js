import electron from 'electron';
import {toggleFilter} from './panel';
import {showLoading} from './notice';

const ipc = electron.ipcRenderer;

export const INIT = 'INIT';
export const UPDATE_FILTER = 'UPDATE_FILTER';

export const init = initialState => ({type: INIT, state: initialState});

export const updateFilter = tags => ({type: UPDATE_FILTER, tags: tags});

export const confirmFilter = tags => dispatch => {
    dispatch(toggleFilter());
    dispatch(showLoading());
    dispatch(updateFilter(tags));

    ipc.send('filter', tags);
};
