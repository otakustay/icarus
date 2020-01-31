import {createReducer} from '@reduxjs/toolkit';
import {
    toggleHelp,
    toggleFullscreen,
    toggleDisturbMode,
    toggleInfo,
    toggleTagList,
    toggleFilter,
} from '../actions/panel';
import {noMore} from '../actions/notice';
import {receiveImage, requestNextImage, requestPreviousImage} from '../actions/image';
import {requestNextArchive, requestPreviousArchive} from '../actions/archive';
import {confirmFilter} from '../actions/app';
import {opening} from '../actions/open';

const INITIAL = {
    isLoading: false,
    isHelpVisible: false,
    isInfoVisible: false,
    isFullscreen: false,
    isDisturbing: false,
    isTagVisible: false,
    isFilterVisible: false,
};

export default createReducer(
    INITIAL,
    {
        [opening.type](state) {
            state.isLoading = true;
        },
        [requestNextImage.type](state) {
            state.isLoading = true;
        },
        [requestPreviousImage.type](state) {
            state.isLoading = true;
        },
        [requestNextArchive.type](state) {
            state.isLoading = true;
        },
        [requestPreviousArchive.type](state) {
            state.isLoading = true;
        },
        [receiveImage.type](state) {
            state.isLoading = false;
        },
        [noMore.type](state) {
            state.isLoading = false;
        },
        [toggleHelp.type](state) {
            state.isHelpVisible = !state.isHelpVisible;
        },
        [toggleInfo.type](state) {
            state.isInfoVisible = !state.isInfoVisible;
        },
        [toggleFullscreen.type](state) {
            state.isFullscreen = !state.isFullscreen;
        },
        [toggleDisturbMode.type](state) {
            state.isDisturbing = !state.isDisturbing;
        },
        [toggleTagList.type](state) {
            state.isTagVisible = !state.isTagVisible;
        },
        [toggleFilter.type](state) {
            state.isFilterVisible = !state.isFilterVisible;
        },
        [confirmFilter.type](state) {
            state.isLoading = true;
            state.isFilterVisible = false;
        },
    }
);
