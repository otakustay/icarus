import * as layouts from '../lib/layout';
import * as actionType from '../action/type';
import {pick} from 'lodash';
import {immutable} from 'san-update';
import moment from 'moment';

let addUnique = value => array => Array.from(new Set(array).add(value));

export default (state, action) => {
    switch (action.type) {
        case actionType.CONTAINER_SIZE_CHANGE:
            return immutable(state)
                .set('container.width', action.width)
                .set('container.height', action.height)
                .value();
        case actionType.NEW_IMAGE:
            let image = pick(action, ['uri', 'name', 'width', 'height']);
            let steps = layouts[state.layout.type](state.container, image);
            return immutable(state)
                .merge('image', image)
                .set('layout.steps', steps)
                .set('layout.stepIndex', 0)
                .set('layout.transition', false)
                .value();
        case actionType.NEW_ARCHIVE:
            let archive = pick(action, ['name', 'tags', 'allTags']);
            return immutable(state).set('archive', archive).value();
        case actionType.TOGGLE_HELP:
            return immutable(state).apply('isHelpVisible', value => !value).value();
        case actionType.TOGGLE_FULLSCREEN:
            return immutable(state).apply('isFullscreen', value => !value).value();
        case actionType.NEXT_STEP:
            return immutable(state)
                .set('layout.transition', true)
                .apply('layout.stepIndex', index => index + 1)
                .value();
        case actionType.PREVIOUS_STEP:
            return immutable(state)
                .set('layout.transition', true)
                .apply('layout.stepIndex', index => index - 1)
                .value();
        case actionType.SHOW_MESSAGE:
            return immutable(state).set('message.show', true).set('message.content', action.message).value();
        case actionType.HIDE_MESSAGE:
            return immutable(state).set('message.show', false).value();
        case actionType.SHOW_LOADING:
            return immutable(state).set('isLoading', true).value();
        case actionType.HIDE_LOADING:
            return immutable(state).set('isLoading', false).value();
        case actionType.CHANGE_LAYOUT:
            let newSteps = layouts[action.layout](state.container, state.image);
            return immutable(state)
                .set('layout.type', action.layout)
                .set('layout.steps', newSteps)
                .set('layout.stepIndex', 0)
                .set('layout.transition', false)
                .value();
        case actionType.TOGGLE_DISTURB_MODE:
            return immutable(state).apply('isDisturbing', mode => !mode).value();
        case actionType.TOGGLE_TIMING:
            return immutable(state).apply('timingBegin', time => (time ? null : moment())).value();
        case actionType.TOGGLE_INFO:
            return immutable(state).apply('isInfoVisible', visible => !visible).value();
        case actionType.TOGGLE_TAG_LIST:
            return immutable(state).apply('isTagVisible', visible => !visible).value();
        case actionType.ADD_TAG:
            let addTag = addUnique(action.tag);
            return immutable(state)
                .apply('archive.tags', addTag)
                .apply('archive.allTags', addTag)
                .value();
        case actionType.REMOVE_TAG:
            return immutable(state).remove('archive.tags', action.tag).value();
        default:
            return state;
    }
};
