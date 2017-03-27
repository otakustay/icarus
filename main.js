/**
 * @file 入口
 * @author otakustay
 */

'use strict';

require('babel-polyfill');

let mkdirp = require('mkdirp');
let path = require('path');
let electron = require('electron');
let Application = require('./service/Application');

const USER_DATA_DIRECTORY = require('electron').app.getPath('userData');
mkdirp.sync(USER_DATA_DIRECTORY);

require('log4js').configure(
    require('path').join(__dirname, '.logrc'),
    {cwd: USER_DATA_DIRECTORY}
);

let app = electron.app;
let icarus = new Application();

let cleanup = async e => {
    e.preventDefault();
    await icarus.exit();
    app.quit();
};

app.on('window-all-closed', () => app.quit());
app.on('ready', () => icarus.start());
app.once('will-quit', cleanup);
