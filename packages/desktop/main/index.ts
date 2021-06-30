import fs from 'fs';
import path from 'path';
import {app, BrowserWindow, BrowserWindowConstructorOptions} from 'electron';
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';
import {setup as setupShelf, ShelfSetupOptions} from './shelf';
import {setup as setupRouter} from './router';
import {setupLogging} from './log';

// `electron-forge`自动生成的
declare const MAIN_WINDOW_WEBPACK_ENTRY: string; // eslint-disable-line init-declarations

setupLogging(app.getPath('userData'));

const prepareElectron = async () => {
    await installExtension(REACT_DEVELOPER_TOOLS);
};

const forceDirectory = (directory: string) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive: true});
    }
};

const prepareApplication = async () => {
    const setupOptions: ShelfSetupOptions = {
        stateStorageDirectory: process.env.NODE_ENV === 'development'
            ? path.join(__dirname, '..', 'storage')
            : path.join(app.getPath('userData')),
        dataStorageDirectory: process.env.NODE_ENV === 'development'
            ? path.join(__dirname, '..', 'storage')
            : path.join(app.getPath('documents'), 'Icarus'),
    };
    forceDirectory(setupOptions.dataStorageDirectory);
    forceDirectory(setupOptions.stateStorageDirectory);
    await setupShelf(setupOptions);

    setupRouter();
};

const createWindow = async () => {
    await prepareElectron();
    await prepareApplication();

    const windowOptions: BrowserWindowConstructorOptions = {
        width: process.env.NODE_ENV === 'development' ? 1000 : 800,
        height: process.env.NODE_ENV === 'development' ? 800 : 600,
        backgroundColor: '#000',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    };
    const mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools({mode: 'bottom'});
    }
};

app.setName('Icarus Comic Reader');
app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());
app.on(
    'activate',
    () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    }
);
