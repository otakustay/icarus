/**
 * @file 入口
 * @author otakustay
 */

'use strict';

let path = require('path');

const BABEL_OPTIONS = {
    presets: ['stage-0', 'es2015'],
    only(filename) {
        return path.relative(__dirname, filename).startsWith('service/');
    }
};
const USER_DATA_DIRECTORY = require('electron').app.getPath('userData');
require('babel-register')(BABEL_OPTIONS);
require('babel-polyfill');
require('log4js').configure(
    require('path').join(__dirname, '.logrc'),
    {cwd: USER_DATA_DIRECTORY}
);

let electron = require('electron');
let app = electron.app;

app.on('window-all-closed', () => app.quit());
app.on('ready', () => require('./service/main').start());
