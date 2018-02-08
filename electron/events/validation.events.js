const ytActionsHelper = require('../helpers/youtube-actions.helper')
const { ipcMain, BrowserWindow } = require('electron')

ipcMain.on('link:validate', (event, link) => {
  const isValid = ytActionsHelper.validateVideoUrl(link)
  const win = BrowserWindow.fromWebContents(event.sender)
  win.webContents.send('link:validation_result', isValid)
})
