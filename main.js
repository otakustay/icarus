/**
 * @file 入口
 * @author otakustay
 */

'use strict';

let mkdirp = require('mkdirp');
let path = require('path');

const USER_DATA_DIRECTORY = require('electron').app.getPath('userData');
mkdirp.sync(USER_DATA_DIRECTORY);

require('babel-polyfill');
require('log4js').configure(
    require('path').join(__dirname, '.logrc'),
    {cwd: USER_DATA_DIRECTORY}
);

let electron = require('electron');
let app = electron.app;

app.on('window-all-closed', () => app.quit());
app.on('ready', () => require('./service/main').start());
