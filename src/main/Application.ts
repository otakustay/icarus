import path from 'path';
import {getLogger} from './util/logger';
import electron from 'electron';
import {start as startRouter} from './router';
import GlobalContext from './GlobalContext';
import IPCQueue from './IPCQueue';
import Storage from './Storage';
import {AppContext} from '../types';

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
const STORAGE_DIRECTORY = DEBUG
    ? path.join(__dirname, '..', 'storage')
    : electron.app.getPath('userData');
const DATABASE_DIRECTORY = DEBUG
    ? path.join(__dirname, '..', 'storage')
    : path.join(electron.app.getPath('documents'), 'Icarus');

const VERSION = electron.app.getVersion();

export default class Application {

    globalContext?: AppContext;

    start(): void {
        logger.info(`Start app version ${VERSION}`);
        logger.silly(`All data will be saved at ${STORAGE_DIRECTORY}`);

        const BrowserWindow = electron.BrowserWindow;
        const mainWindow = new BrowserWindow(WINDOW_OPTIONS);
        const url = process.env.NODE_ENV === 'production'
            ? 'file://' + path.join(__dirname, 'index.html')
            : `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;
        mainWindow.loadURL(url);

        if (DEBUG) {
            mainWindow.maximize();
        }

        logger.silly(`Main window opened with size ${WINDOW_OPTIONS.width} x ${WINDOW_OPTIONS.height}`);

        const ipc = new IPCQueue(electron.ipcMain);
        const storage = new Storage(DATABASE_DIRECTORY, STORAGE_DIRECTORY);
        this.globalContext = new GlobalContext(ipc, storage, VERSION);
        startRouter(this.globalContext);
    }

    exit(): Promise<void> {
        logger.info(`Exit app version ${VERSION}`);

        return this.globalContext ? this.globalContext.dispose() : Promise.resolve();
    }
}
