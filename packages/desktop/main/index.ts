import {app, BrowserWindow, BrowserWindowConstructorOptions} from 'electron';

// `electron-forge`自动生成的
// eslint-disable-next-line init-declarations
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const createWindow = (): void => {
    const windowOptions: BrowserWindowConstructorOptions = {
        width: 800,
        height: 600,
        backgroundColor: '#000',
        webPreferences: {
            nodeIntegration: true,
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
