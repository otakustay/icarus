import fs from 'fs';
import path from 'path';
import {app, BrowserWindow, BrowserWindowConstructorOptions} from 'electron';
import {setup as setupShelf} from './shelf';
import {setup as setupRouter} from './router';

// `electron-forge`自动生成的
// eslint-disable-next-line init-declarations
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const prepareApplication = async () => {
    const storageDirectory = process.env.NODE_ENV === 'development'
        ? path.join(__dirname, '..', 'storage')
        : path.join(__dirname, '..', 'storage'); // TODO: 改为正式环境的地址
    if (!fs.existsSync(storageDirectory)) {
        fs.mkdirSync(storageDirectory, {recursive: true});
    }
    await setupShelf(storageDirectory);
    setupRouter();
};

const createWindow = async () => {
    await prepareApplication();

    const windowOptions: BrowserWindowConstructorOptions = {
        width: 800,
        height: 600,
        backgroundColor: '#000',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    };
    const mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
};

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
