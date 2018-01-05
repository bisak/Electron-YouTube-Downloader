const { ipcMain, BrowserWindow } = require('electron')
const ytdl = require('ytdl-core')
const fs = require('fs')
const path = require('path')

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
  let videoStream = ytdl.downloadFromInfo(videoInfo)
  videoStream.pipe(fs.createWriteStream(`${path.normalize(videoInfo.title)}.mp4`))
  videoStream.on('end', () => {
    console.log('video downloaded')
    win.webContents.send('video:download_success')
  })
})
