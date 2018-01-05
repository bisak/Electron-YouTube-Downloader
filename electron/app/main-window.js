const electron = require('electron')
const path = require('path')
const url = require('url')
const { isInDevMode } = require('../helpers/general.helper')
const { BrowserWindow } = electron

class MainWindow extends BrowserWindow {
  constructor () {
    super({ width: 550, height: 700, resizable: false })
    this.showWindow()
  }

  showWindow () {
    if (isInDevMode()) {
      this.loadURL(`http://localhost:4200/`)
    } else {
      this.loadURL(url.format({
        pathname: path.join(__dirname, '../angular-build/index.html'),
        protocol: 'file:',
        slashes: true
      }))
    }
  }
}

module.exports = MainWindow
