import 'babel-polyfill';
import electron from 'electron';
import {render} from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import * as receivers from './lib/receiver';
import App from './container/App';

const initialState = {
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
    tags: {
        all: [],
        collisions: {}
    },
    filter: {
        tags: []
    },
    isLoading: false,
    isHelpVisible: false,
    isInfoVisible: false,
    isFullscreen: false,
    isDisturbing: false,
    isTagVisible: false,
    isFilterVisible: false
};
const store = createStore(
    reducer,
    initialState,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

const connect = (channel, module) => {
    const receiver = receivers[module];
    electron.ipcRenderer.on(channel, (e, result) => store.dispatch(receiver(result)));
};

connect('init', 'init');
connect('image', 'image');
connect('no-more', 'noMore');
connect('no-state', 'noState');
connect('archive', 'archive');
connect('tag', 'tag');
connect('filter', 'filter');
connect('service-error', 'serviceError');

electron.ipcRenderer.send('init');

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
