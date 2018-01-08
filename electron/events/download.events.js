const { ipcMain, BrowserWindow, dialog, app } = require('electron')
const ytdl = require('ytdl-core')
const fs = require('fs')
const path = require('path')
const filenamify = require('filenamify')

ipcMain.on('link:submit', (event, url) => {
  const win = BrowserWindow.fromWebContents(event.sender)

  ytdl.getInfo(url).then((videoInfo) => {
    win.webContents.send('link:video_info_success', videoInfo)
  }).catch((error) => {
    win.webContents.send('link:video_info_error', error)
    console.log('send info error', error)
  })

})

ipcMain.on('video:download_single', (event, videoInfo) => {
  const win = BrowserWindow.fromWebContents(event.sender)

  const pathToSave = dialog.showSaveDialog({
    title: 'Save Video',
    defaultPath: path.join(app.getPath('videos'), filenamify(videoInfo.title))
  })

  if (pathToSave) {
    let videoStream = ytdl(videoInfo.video_url)
    videoStream.pipe(fs.createWriteStream(pathToSave))

    videoStream.once('response', () => {
      win.webContents.send('video:download_start')
    })

    videoStream.on('progress', (chunkLength, downloaded, total) => {
      const percentDownloaded = ((downloaded / total) * 100).toFixed(2)
      win.webContents.send('video:download_progress', { percentDownloaded })
    })

    videoStream.on('end', () => {
      win.webContents.send('video:download_success')
    })
  } else {
    win.webContents.send('video:download_cancelled')
  }

})
