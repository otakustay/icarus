import 'babel-polyfill';
import path from 'path';
import mkdirp from 'mkdirp';
import electron from 'electron';
import log4js from 'log4js';
import installExtension, {REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import Application from './service/Application';

const DEBUG = process.argv.includes('--debug');
if (DEBUG) {
    installExtension(REACT_DEVELOPER_TOOLS);
    installExtension(REDUX_DEVTOOLS);
}

const USER_DATA_DIRECTORY = electron.app.getPath('userData');
mkdirp.sync(USER_DATA_DIRECTORY);

log4js.configure(
    path.join(__dirname, '.logrc'),
    {cwd: USER_DATA_DIRECTORY}
);

let app = electron.app;
let icarus = new Application();

let setMenu = () => {
    let template = [
        {
            label: "Application",
            submenu: [
                {role: 'about'},
                {type: "separator" },
                {role: 'quit'}
            ]
        },
        {
            label: "Edit",
            submenu: [
                {role: 'copy'},
                {role: 'paste'},
                {role: 'selectall'}
            ]
        },
        {
            label: 'View',
            submenu: [
                {role: 'toggledevtools'}
            ]
        }
    ];

    electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));
};

let cleanup = async e => {
    e.preventDefault();
    await icarus.exit();
    app.quit();
};

app.on('window-all-closed', () => app.quit());
app.on(
    'ready',
    () => {
        setMenu();
        icarus.start()
    }
);
app.once('will-quit', cleanup);
