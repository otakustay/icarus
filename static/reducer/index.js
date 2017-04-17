import {flow, pick, cond, eq, stubTrue, identity, property, nthArg} from 'lodash/fp';
import {set, apply, applyWith} from 'san-update/fp';
import {immutable} from 'san-update';
import moment from 'moment';
import * as layouts from '../lib/layout';
import * as actionType from '../action/type';
import {isReading} from '../selector';

let addUnique = value => array => Array.from(new Set(array).add(value));
let pickArchive = pick(['name', 'tags', 'total', 'index']);
let pickImage = pick(['uri', 'name', 'width', 'height']);
let toggle = value => !value;

let doLayout = flow(
    applyWith(
        'layout.steps',
        [property('layout'), property('container'), property('image')],
        (layout, container, image) => layouts[layout.type](container, image)
    ),
    set('layout.stepIndex', 0),
    set('layout.transition', false)
);
let performLayout = cond([[isReading, doLayout], [stubTrue, identity]]);

let init = (state, action) => ({...state, ...action.state});
let changeContainerSize = (state, {width, height}) => ({...state, container: {width, height}});
let changeImage = (state, action) => ({...state, image: pickImage(action)});
let changeArchive = (state, action) => ({...state, archive: pickArchive(action)});
let toggleHelp = apply('isHelpVisible', toggle);
let toggleFullscreen = apply('isFullscreen', toggle);
let nextStep = flow(set('layout.transition', true), apply('layout.stepIndex', index => index + 1));
let previousStep = flow(set('layout.transition', true), apply('layout.stepIndex', index => index - 1));
let showMessage = (state, action) => ({...state, message: {show: true, content: action.message}});
let hideMessage = set('message', {show: false, content: ''});
let showLoading = set('isLoading', true);
let hideLoading = set('isLoading', false);
let changeLayoutType = (state, action) => immutable(state).set('layout.type', action.layout).value();
let toggleDisturbMode = apply('isDisturbing', toggle);
let toggleTiming = apply('timingBegin', time => (time ? null : moment()));
let toggleInfo = apply('isInfoVisible', toggle);
let toggleTagList = apply('isTagVisible', toggle);
let addTag = (state, action) => immutable(state).apply('archive.tags', addUnique(action.tag)).value();
let removeTag = (state, action) => immutable(state).remove('archive.tags', action.tag).value();
let updateTags = (state, action) => immutable(state).set('tags.all', action.all).value();
let toggleFilter = apply('isFilterVisible', toggle);
let updateFilter = (state, action) => immutable(state).set('filter.tags', action.tags).value();

let type = value => flow(nthArg(1), property('type'), eq(value));
let cases = [
    [type(actionType.INIT), init],
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
    [type(actionType.UPDATE_TAGS), updateTags],
    [type(actionType.TOGGLE_FILTER), toggleFilter],
    [type(actionType.UPDATE_FILTER), updateFilter],
    [stubTrue, identity]
];

export default cond(cases);
