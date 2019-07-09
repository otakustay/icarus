import {flow, pick, cond, eq, stubTrue, identity, property, nthArg} from 'lodash/fp';
import {set, apply, applyWith} from 'san-update/fp';
import {immutable} from 'san-update';
import moment from 'moment';
import * as layouts from '../lib/layouts';
import {
    INIT,
    CONTAINER_SIZE_CHANGE,
    NEW_IMAGE,
    NEW_ARCHIVE,
    TOGGLE_HELP,
    TOGGLE_FULLSCREEN,
    NEXT_STEP,
    PREVIOUS_STEP,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    SHOW_LOADING,
    HIDE_LOADING,
    CHANGE_LAYOUT,
    TOGGLE_DISTURB_MODE,
    TOGGLE_TIMING,
    TOGGLE_INFO,
    TOGGLE_TAG_LIST,
    ADD_TAG,
    REMOVE_TAG,
    UPDATE_TAGS,
    TOGGLE_FILTER,
    UPDATE_FILTER,
} from '../actions';
import {isReading} from '../selectors';

const addUnique = value => array => Array.from(new Set(array).add(value));
const pickArchive = pick(['name', 'tags', 'total', 'index']);
const pickImage = pick(['uri', 'name', 'width', 'height']);
const toggle = value => !value;

const doLayout = flow(
    applyWith(
        'layout.steps',
        [property('layout'), property('container'), property('image')],
        (layout, container, image) => layouts[layout.type](container, image)
    ),
    set('layout.stepIndex', 0),
    set('layout.transition', false)
);
const performLayout = cond([[isReading, doLayout], [stubTrue, identity]]);

const init = (state, action) => ({...state, ...action.state});
const changeContainerSize = (state, {width, height}) => ({...state, container: {width, height}});
const changeImage = (state, action) => ({...state, image: pickImage(action)});
const changeArchive = (state, action) => ({...state, archive: pickArchive(action)});
const toggleHelp = apply('isHelpVisible', toggle);
const toggleFullscreen = apply('isFullscreen', toggle);
const nextStep = flow(set('layout.transition', true), apply('layout.stepIndex', index => index + 1));
const previousStep = flow(set('layout.transition', true), apply('layout.stepIndex', index => index - 1));
const showMessage = (state, action) => ({...state, message: {show: true, ...action.payload}});
const hideMessage = set('message', {show: false, content: ''});
const showLoading = set('isLoading', true);
const hideLoading = set('isLoading', false);
const changeLayoutType = (state, action) => immutable(state).set('layout.type', action.layout).value();
const toggleDisturbMode = apply('isDisturbing', toggle);
const toggleTiming = apply('timingBegin', time => (time ? null : moment()));
const toggleInfo = apply('isInfoVisible', toggle);
const toggleTagList = apply('isTagVisible', toggle);
const addTag = (state, action) => immutable(state).apply('archive.tags', addUnique(action.tag)).value();
const removeTag = (state, action) => immutable(state).remove('archive.tags', action.tag).value();
const updateTags = (state, action) => immutable(state).set('tags.all', action.all).value();
const toggleFilter = apply('isFilterVisible', toggle);
const updateFilter = (state, action) => immutable(state).set('filter.tags', action.tags).value();

const type = value => flow(nthArg(1), property('type'), eq(value));
const cases = [
    [type(INIT), init],
    [type(CONTAINER_SIZE_CHANGE), flow(changeContainerSize, performLayout)],
    [type(NEW_IMAGE), flow(changeImage, performLayout)],
    [type(NEW_ARCHIVE), changeArchive],
    [type(TOGGLE_HELP), toggleHelp],
    [type(TOGGLE_FULLSCREEN), toggleFullscreen],
    [type(NEXT_STEP), nextStep],
    [type(PREVIOUS_STEP), previousStep],
    [type(SHOW_MESSAGE), showMessage],
    [type(HIDE_MESSAGE), hideMessage],
    [type(SHOW_LOADING), showLoading],
    [type(HIDE_LOADING), hideLoading],
    [type(CHANGE_LAYOUT), flow(changeLayoutType, performLayout)],
    [type(TOGGLE_DISTURB_MODE), toggleDisturbMode],
    [type(TOGGLE_TIMING), toggleTiming],
    [type(TOGGLE_INFO), toggleInfo],
    [type(TOGGLE_TAG_LIST), toggleTagList],
    [type(ADD_TAG), addTag],
    [type(REMOVE_TAG), removeTag],
    [type(UPDATE_TAGS), updateTags],
    [type(TOGGLE_FILTER), toggleFilter],
    [type(UPDATE_FILTER), updateFilter],
    [stubTrue, identity],
];

export default cond(cases);
