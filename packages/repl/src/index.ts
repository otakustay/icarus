import {start} from './terminal';
import BackendService from './BackendService';

const service = new BackendService();

// eslint-disable-next-line @typescript-eslint/no-empty-function
const safeFail = (fn: () => Promise<void>) => () => fn().catch(() => {});

process.on('uncaughtException', safeFail(() => service.dispose()));
process.on('unhandledRejection', safeFail(() => service.dispose()));

start(service);
