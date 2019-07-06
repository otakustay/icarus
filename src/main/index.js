import mkdirp from 'mkdirp';
import electron from 'electron';
import installExtension, {REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';
import Application from './Application';

const DEBUG = !!process.env.DEBUG;

const USER_DATA_DIRECTORY = electron.app.getPath('userData');
mkdirp.sync(USER_DATA_DIRECTORY);

const app = electron.app;
const icarus = new Application();

const setMenu = () => {
    const template = [
        {
            label: 'Application',
            submenu: [
                {role: 'about'},
                {type: 'separator'},
                {role: 'quit'},
            ],
        },
        {
            label: 'Edit',
            submenu: [
                {role: 'copy'},
                {role: 'paste'},
                {role: 'selectall'},
            ],
        },
        {
            label: 'View',
            submenu: [
                {role: 'toggledevtools'},
            ],
        },
    ];

    electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));
};

const cleanup = async e => {
    e.preventDefault();
    await icarus.exit();
    app.quit();
};

app.on('window-all-closed', () => app.quit());
app.on(
    'ready',
    () => {
        if (DEBUG) {
            installExtension(REACT_DEVELOPER_TOOLS);
            installExtension(REDUX_DEVTOOLS);
        }

        setMenu();
        icarus.start();
    }
);
app.once('will-quit', cleanup);
