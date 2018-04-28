import path from 'path';
import log4js from 'log4js';
import electron from 'electron';
import {start as startRouter} from './router';
import GlobalContext from './GlobalContext';
import IPCQueue from './IPCQueue';
import Storage from './Storage';

const logger = log4js.getLogger('main');

const DEBUG = process.argv.includes('--debug');
const INITIAL_WINDOW_SIZE = {width: 800, height: 600, backgroundColor: '#000'};
const STORAGE_DIRECTORY = DEBUG ? path.join(__dirname, '..', 'storage') : electron.app.getPath('userData');
const VERSION = electron.app.getVersion();

export default class Application {

    globalContext = null;

    start() {
        logger.info(`Start app version ${VERSION}`);
        logger.trace(`All data will be saved at ${STORAGE_DIRECTORY}`);

        const BrowserWindow = electron.BrowserWindow;
        const mainWindow = new BrowserWindow(INITIAL_WINDOW_SIZE);
        const url = 'file://' + path.join(__dirname, '..', 'static', 'index.html');
        mainWindow.loadURL(url);

        if (DEBUG) {
            mainWindow.maximize();
        }

        logger.trace(`Main window opened with size ${INITIAL_WINDOW_SIZE.width} x ${INITIAL_WINDOW_SIZE.height}`);

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
