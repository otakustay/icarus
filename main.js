'use strict'

const BABEL_OPTIONS = {
    presets: ['stage-0', 'es2015']
}
const USER_DATA_DIRECTORY = require('electron').app.getPath('userData')
require('babel-register')(BABEL_OPTIONS)
require('babel-polyfill')
require('log4js').configure(
    require('path').join(__dirname, '.logrc'),
    {cwd: USER_DATA_DIRECTORY}
)

let electron = require('electron')
let app = electron.app

app.on('window-all-closed', () => app.quit())
app.on('ready', () => require('./service/main').start())
