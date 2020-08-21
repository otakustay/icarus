import electron from 'electron';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {RecoilRoot} from 'recoil';
import * as receivers from './lib/receivers';
import store from './store';
import App from './components/App';
import './styles';

const connect = (channel: string, module: any) => {
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
    <RecoilRoot>
        <Provider store={store}>
            <App />
        </Provider>
    </RecoilRoot>,
    document.getElementById('app')
);
