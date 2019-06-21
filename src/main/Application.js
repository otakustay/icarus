import path from 'path';
import {getLogger} from './util/logger';
import electron from 'electron';
import {start as startRouter} from './router';
import GlobalContext from './GlobalContext';
import IPCQueue from './IPCQueue';
import Storage from './Storage';

const logger = getLogger('main');

const DEBUG = process.argv.includes('--debug');
const WINDOW_OPTIONS = {
    width: 800,
    height: 600,
    backgroundColor: '#000',
    webPreferences: {
        nodeIntegration: true,
    },
};
const STORAGE_DIRECTORY = DEBUG ? path.join(__dirname, '..', 'storage') : electron.app.getPath('userData');
const VERSION = electron.app.getVersion();

export default class Application {

    globalContext = null;

    start() {
        logger.info(`Start app version ${VERSION}`);
        logger.trace(`All data will be saved at ${STORAGE_DIRECTORY}`);

        const BrowserWindow = electron.BrowserWindow;
        const mainWindow = new BrowserWindow(WINDOW_OPTIONS);
        // const url = 'file://' + path.join(__dirname, '..', 'renderer', 'index.html');
        const url = process.env.NODE_ENV === 'production'
            ? 'file://' + path.join(__dirname, 'index.html')
            : `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;
        mainWindow.loadURL(url);

        if (DEBUG) {
            mainWindow.maximize();
        }

        logger.trace(`Main window opened with size ${WINDOW_OPTIONS.width} x ${WINDOW_OPTIONS.height}`);

        const ipc = new IPCQueue(electron.ipcMain);
        const storage = new Storage(STORAGE_DIRECTORY);
        this.globalContext = new GlobalContext(ipc, storage, VERSION);
        startRouter(this.globalContext);
    }

    exit() {
        logger.info(`Exit app version ${VERSION}`);

        return this.globalContext.dispose();
    }
}
