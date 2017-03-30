import {flow, pick, cond, eq, stubTrue, identity, property, nthArg} from 'lodash/fp';
import {immutable, macro} from 'san-update';
import moment from 'moment';
import * as layouts from '../lib/layout';
import * as actionType from '../action/type';
import {isReading} from '../selector';

let addUnique = value => array => Array.from(new Set(array).add(value));
let pickArchive = pick(['name', 'tags', 'allTags']);
let pickImage = pick(['uri', 'name', 'width', 'height']);
let toggle = value => !value;

let performLayout = state => {
    if (!isReading(state)) {
        return state;
    }

    let steps = layouts[state.layout.type](state.container, state.image);
    return immutable(state)
        .set('layout.steps', steps)
        .set('layout.stepIndex', 0)
        .set('layout.transition', false)
        .value();
};

let changeContainerSize = (state, {width, height}) => ({...state, container: {width, height}});
let changeImage = (state, action) => ({...state, image: pickImage(action)});
let changeArchive = (state, action) => ({...state, archive: pickArchive(action)});
let toggleHelp = macro().apply('isHelpVisible', toggle).build();
let toggleFullscreen = macro().apply('isFullscreen', toggle).build();
let nextStep = macro().set('layout.transition', true).apply('layout.stepIndex', index => index + 1).build();
let previousStep = macro().set('layout.transition', true).apply('layout.stepIndex', index => index - 1).build();
let showMessage = (state, action) => ({...state, message: {show: true, content: action.message}});
let hideMessage = macro().set('message', {show: false, content: ''}).build();
let showLoading = macro().set('isLoading', true).build();
let hideLoading = macro().set('isLoading', false).build();
let changeLayoutType = (state, action) => immutable(state).set('layout.type', action.layout).value();
let toggleDisturbMode = macro().apply('isDisturbing', toggle).build();
let toggleTiming = macro().apply('timingBegin', time => (time ? null : moment())).build();
let toggleInfo = macro().apply('isInfoVisible', toggle).build();
let toggleTagList = macro().apply('isTagVisible', toggle).build();
let addTag = (state, action) => {
    let addTag = addUnique(action.tag);
    return immutable(state)
        .apply('archive.tags', addTag)
        .apply('archive.allTags', addTag)
        .value();
};
let removeTag = (state, action) => immutable(state).remove('archive.tags', action.tag).value();

let type = value => flow(nthArg(1), property('type'), eq(value));
let cases = [
    [type(actionType.CONTAINER_SIZE_CHANGE), flow(changeContainerSize, performLayout)],
    [type(actionType.NEW_IMAGE), flow(changeImage, performLayout)],
    [type(actionType.NEW_ARCHIVE), changeArchive],
    [type(actionType.TOGGLE_HELP), toggleHelp],
    [type(actionType.TOGGLE_FULLSCREEN), toggleFullscreen],
    [type(actionType.NEXT_STEP), nextStep],
    [type(actionType.PREVIOUS_STEP), previousStep],
    [type(actionType.SHOW_MESSAGE), showMessage],
    [type(actionType.HIDE_MESSAGE), hideMessage],
    [type(actionType.SHOW_LOADING), showLoading],
    [type(actionType.HIDE_LOADING), hideLoading],
    [type(actionType.CHANGE_LAYOUT), flow(changeLayoutType, performLayout)],
    [type(actionType.TOGGLE_DISTURB_MODE), toggleDisturbMode],
    [type(actionType.TOGGLE_TIMING), toggleTiming],
    [type(actionType.TOGGLE_INFO), toggleInfo],
    [type(actionType.TOGGLE_TAG_LIST), toggleTagList],
    [type(actionType.ADD_TAG), addTag],
    [type(actionType.REMOVE_TAG), removeTag],
    [stubTrue, identity]
];

export default cond(cases);
