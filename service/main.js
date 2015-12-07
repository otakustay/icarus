/**
 * @file 入口
 * @author otakustay
 */

'use strict';


let GlobalContext = require('./GlobalContext');
let IPCQueue = require('./IPCQueue');
let Storage = require('./Storage');
let electron = require('electron');
let logger = require('log4js').getLogger('main');

const INITIAL_WINDOW_SIZE = {width: 800, height: 600};
const STORAGE_DIRECTORY = electron.app.getPath('userData');
const VERSION = electron.app.getVersion();

/**
 * 启动应用后端
 */
exports.start = () => {
    logger.info(`Start app version ${VERSION}`);
    logger.trace(`All data will be saved at ${STORAGE_DIRECTORY}`);

    let BrowserWindow = electron.BrowserWindow;
    let mainWindow = new BrowserWindow(INITIAL_WINDOW_SIZE);
    let url = 'file://' + require('path').join(__dirname, '..', 'static', 'index.html');
    mainWindow.loadURL(url);

    logger.trace(`Main window opened with size ${INITIAL_WINDOW_SIZE.width} x ${INITIAL_WINDOW_SIZE.height}`);

    let ipc = new IPCQueue(electron.ipcMain);
    let storage = new Storage(STORAGE_DIRECTORY);
    let globalContext = new GlobalContext(ipc, storage, VERSION);
    require('./router').start(globalContext);
};

