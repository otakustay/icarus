import electron from 'electron';
import {INIT, UPDATE_FILTER} from './type';
import {toggleFilter} from './panel';
import {showLoading} from './notice';

let ipc = electron.ipcRenderer;

export let init = initialState => ({type: INIT, state: initialState});

export let updateFilter = tags => ({type: UPDATE_FILTER, tags: tags});

export let confirmFilter = tags => dispatch => {
    dispatch(toggleFilter());
    dispatch(showLoading());
    dispatch(updateFilter(tags));

    ipc.send('filter', tags);
};
