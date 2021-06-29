import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {registerService, RouteExecute, RouteRegistry, DefaultServiceContext} from '@icarus/service';
import {currentShelf} from './shelf';

const registerRoute = (method: 'GET' | 'POST', path: string, execute: RouteExecute) => ipcMain.handle(
    `${method} ${path}`,
    async (event: IpcMainInvokeEvent, params: unknown, body: unknown) => {
        const context = new DefaultServiceContext(currentShelf(), params, body);
        await execute(context);

        if (context.response.state === 'pending') {
            throw new Error(`Handler for ${method} ${path} enters a forever pending state`);
        }

        if (context.response.state === 'hasError') {
            const {type, code, message} = context.response;
            throw new Error(`[${type.toUpperCase()}:${code}] ${message}`);
        }

        return context.response.data;
    }
);

const registry: RouteRegistry = {
    get(path, execute) {
        registerRoute('GET', path, execute);
    },
    post(path, execute) {
        registerRoute('POST', path, execute);
    },
};

export const setup = () => {
    registerService(registry);
};