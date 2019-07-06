import electron from 'electron';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import * as receivers from './lib/receivers';
import store from './store';
import App from './components/App';

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
