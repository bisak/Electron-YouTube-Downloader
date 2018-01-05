const yvh = require('../helpers/youtube-actions.helper')
const { ipcMain, BrowserWindow } = require('electron')

ipcMain.on('link:validate', (event, link) => {
  const isValid = yvh.validateVideoUrl(link)
  const win = BrowserWindow.fromWebContents(event.sender)
  win.webContents.send('link:validate_result', isValid)
})
