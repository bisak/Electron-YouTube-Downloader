const { ipcMain, BrowserWindow, dialog, app } = require('electron')
const ytdl = require('ytdl-core')
const fs = require('fs')
const path = require('path')
const filenamify = require('filenamify')
const ffmpeg = require('fluent-ffmpeg')
const fse = require('fs-extra')
const shortid = require('shortid')

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
    const tempDir = path.join(app.getPath('temp'), `Electron_Downloader`)
    fse.ensureDir(tempDir).then(() => {
      const randomTempName = shortid.generate()
      const tempAudioPath = path.join(tempDir, `${randomTempName}_audio`)
      const tempVideoPath = path.join(tempDir, `${randomTempName}_video`)

      let videoStream = ytdl(videoInfo.video_url, { filter: 'videoonly' })
      videoStream.pipe(fs.createWriteStream(tempVideoPath))

      let audioStream = ytdl(videoInfo.video_url, { filter: 'audioonly' })
      audioStream.pipe(fs.createWriteStream(tempAudioPath))

      let videoStreamStartPromise = new Promise((resolve, reject) => {
        videoStream.once('response', resolve)
      })

      let audioStreamStartPromise = new Promise((resolve, reject) => {
        audioStream.once('response', resolve)
      })

      Promise.all([videoStreamStartPromise, audioStreamStartPromise]).then(() => {
        win.webContents.send('video:download_start')
      })

      let audioProgress = 0
      let videoProgress = 0

      videoStream.on('progress', (chunkLength, downloaded, total) => {
        videoProgress = ((downloaded / total) * 100)
      })

      audioStream.on('progress', (chunkLength, downloaded, total) => {
        audioProgress = ((downloaded / total) * 100)
      })

      let progressNotifier = setInterval(() => {
        let percentDownloaded = (audioProgress + videoProgress) / 2
        win.webContents.send('video:download_progress', { percentDownloaded })
      }, 2000)

      let videoStreamEndPromise = new Promise((resolve, reject) => {
        videoStream.on('end', resolve)
      })

      let audioStreamEndPromise = new Promise((resolve, reject) => {
        audioStream.on('end', resolve)
      })

      Promise.all([videoStreamEndPromise, audioStreamEndPromise]).then(() => {
        win.webContents.send('video:download_success')
        clearInterval(progressNotifier)
        console.log('here')
        ffmpeg.ffprobe(tempVideoPath, (err, metadata) => {
          console.log(err)
          console.log(metadata)
        })
      })
    })
  } else {
    win.webContents.send('video:download_cancelled')
  }
})
