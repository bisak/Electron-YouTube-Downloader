const { ipcMain, BrowserWindow, dialog, app } = require('electron')
const ytdl = require('ytdl-core')
const path = require('path')
const filenamify = require('filenamify')
const isPlaylist = require('is-playlist')
const ytpl = require('ytpl')
const videoDownloadHelper = require('../helpers/video-download.helper')
const audioDownloadHelper = require('../helpers/audio-download.helper')


ipcMain.on('link:submit', (event, url) => {
  const win = BrowserWindow.fromWebContents(event.sender)

  if (isPlaylist(url)) {
    ytpl(url, { limit: 200 }).then((playlistInfo) => {
      let videoInfoPromises = []
      playlistInfo.items.forEach((item) => {
        videoInfoPromises.push(ytdl.getInfo(item.url_simple))
      })
      return Promise.all(videoInfoPromises).then((videosInfo) => {
        win.webContents.send('link:playlist_info_success', videosInfo)
      })
    }).catch((error) => {
      win.webContents.send('link:playlist_info_error', error) // TODO add error handler
      console.log('PLAYLIST INFO ERROR', error)
    })
  } else {
    ytdl.getInfo(url).then((videoInfo) => {
      win.webContents.send('link:video_info_success', videoInfo)
    }).catch((error) => {
      win.webContents.send('link:video_info_error', error) // TODO add error handler
      console.log('VIDEO INFO ERROR', error)
    })
  }
})

ipcMain.on('video:download_single', (event, videoInfo, chosenFormat) => {
  const win = BrowserWindow.fromWebContents(event.sender)

  const pathToSave = dialog.showSaveDialog({
    title: 'Save Video',
    defaultPath: path.join(app.getPath('videos'), `${filenamify(videoInfo.title)}${chosenFormat}`)
  })

  if (pathToSave) {
    if (pathToSave.endsWith('.mp3')) {
      audioDownloadHelper.downloadAudio(win, videoInfo, pathToSave)
    } else {
      videoDownloadHelper.downloadVideoAndAudio(win, videoInfo, pathToSave)
    }
  } else {
    win.webContents.send('video:download_cancelled')
  }
})
