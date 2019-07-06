import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

const initialState = {
    image: {
        name: null,
        uri: null,
        width: null,
        height: null,
    },
    archive: {
        name: null,
        tags: [],
        allTags: [],
    },
    container: {
        width: null,
        height: null,
    },
    layout: {
        type: 'topBottom',
        steps: [],
        stepIndex: 0,
    },
    message: {
        show: false,
        content: '',
    },
    tags: {
        all: [],
        collisions: {},
    },
    filter: {
        tags: [],
    },
    isLoading: false,
    isHelpVisible: false,
    isInfoVisible: false,
    isFullscreen: false,
    isDisturbing: false,
    isTagVisible: false,
    isFilterVisible: false,
};
export default createStore(
    reducer,
    initialState,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);
