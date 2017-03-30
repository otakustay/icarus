import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import reducer from './reducer';
import App from './container/App';
import * as receivers from './lib/receiver';
import electron from 'electron';

let initialState = {
    image: {
        name: null,
        uri: null,
        width: null,
        height: null
    },
    archive: {
        name: null,
        tags: [],
        allTags: []
    },
    container: {
        width: null,
        height: null
    },
    layout: {
        type: 'topBottom',
        steps: [],
        stepIndex: 0
    },
    message: {
        show: false,
        content: ''
    },
    isLoading: false,
    isHelpVisible: false,
    isInfoVisible: false,
    isFullscreen: false,
    isDisturbing: false,
    isTagVisible: false
};
let store = createStore(
    reducer,
    initialState,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

let connect = (channel, module) => {
    let receiver = receivers[module];
    electron.ipcRenderer.on(channel, (e, result) => store.dispatch(receiver(result)));
};

connect('image', 'image');
connect('no-more', 'noMore');
connect('no-state', 'noState');
connect('archive', 'archive');

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);