import {flow, pick, cond, eq, stubTrue, identity, property, nthArg} from 'lodash/fp';
import {set, apply, applyWith} from 'san-update/fp';
import {immutable} from 'san-update';
import moment from 'moment';
import * as layouts from '../lib/layout';
import * as actionType from '../action/type';
import {isReading} from '../selector';

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
const showMessage = (state, action) => ({...state, message: {show: true, content: action.message}});
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
    [stubTrue, identity],
];

export default cond(cases);
