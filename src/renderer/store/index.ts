import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import archive from './archive';
import filter from './filter';
import image from './image';
import message from './message';
import tags from './tags';
import view from './view';

const reducer = combineReducers({archive, filter, image, message, tags, view});

const store = configureStore({reducer, devTools: true});

export default store;
export type State = ReturnType<typeof reducer>;
