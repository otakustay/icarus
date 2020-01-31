import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import archive from './archive';
import filter from './filter';
import image from './image';
import layout from './layout';
import message from './message';
import tags from './tags';
import timing from './timing';
import view from './view';

const reducer = combineReducers({archive, filter, image, layout, message, tags, timing, view});

const store = configureStore({reducer, devTools: true});

export default store;
export type State = ReturnType<typeof reducer>;
