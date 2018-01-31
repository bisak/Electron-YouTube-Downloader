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

ipcMain.on('video:download_single', (event, videoInfo, choosenFormat) => {
  const win = BrowserWindow.fromWebContents(event.sender)

  const pathToSave = dialog.showSaveDialog({
    title: 'Save Video',
    defaultPath: path.join(app.getPath('videos'), `${filenamify(videoInfo.title)}${choosenFormat}`)
  })

  if (pathToSave) {
    const tempDir = path.join(app.getPath('temp'), `Electron_Downloader`)
    fse.ensureDir(tempDir).then(() => {
      let { videoStream, audioStream, tempVideoPath, tempAudioPath } = startDL(videoInfo, tempDir)
      notifyDLStart(win, videoStream, audioStream)
      notifyDLProgress(win, videoStream, audioStream)
      handleDLEnd(videoStream, audioStream).then(() => {
        return handleConversion(win, tempVideoPath, tempAudioPath, pathToSave).then(() => {
          notifyDLEnd(win)
        })
      }).catch(console.log)
    })
  } else {
    win.webContents.send('video:download_cancelled')
  }
})

function startDL (videoInfo, tempDir) {
  const randomTempName = shortid.generate()
  const tempAudioPath = path.join(tempDir, `${randomTempName}_audio`)
  const tempVideoPath = path.join(tempDir, `${randomTempName}_video`)

  let videoStream = ytdl(videoInfo.video_url, { filter: 'videoonly' })
  videoStream.pipe(fs.createWriteStream(tempVideoPath))

  let audioStream = ytdl(videoInfo.video_url, { filter: 'audioonly' })
  audioStream.pipe(fs.createWriteStream(tempAudioPath))

  return { videoStream, audioStream, tempVideoPath, tempAudioPath }
}

function notifyDLStart (win, videoStream, audioStream) {
  let videoStreamStartPromise = new Promise((resolve, reject) => {
    videoStream.once('response', resolve)
  })

  let audioStreamStartPromise = new Promise((resolve, reject) => {
    audioStream.once('response', resolve)
  })

  Promise.all([videoStreamStartPromise, audioStreamStartPromise]).then(() => {
    win.webContents.send('video:download_start')
  })
}


function notifyDLProgress (win, videoStream, audioStream) {
  let percentDownloaded = 0
  let audioProgress = 0
  let videoProgress = 0

  videoStream.on('progress', (chunkLength, downloaded, total) => {
    videoProgress = ((downloaded / total) * 100)
    percentDownloaded = (audioProgress + videoProgress) / 2
    win.webContents.send('video:download_progress', { percentDownloaded })
  })

  audioStream.on('progress', (chunkLength, downloaded, total) => {
    audioProgress = ((downloaded / total) * 100)
    percentDownloaded = (audioProgress + videoProgress) / 2
    win.webContents.send('video:download_progress', { percentDownloaded })
  })
}

function handleDLEnd (videoStream, audioStream) {
  let videoStreamEndPromise = new Promise((resolve, reject) => {
    videoStream.on('end', resolve)
  })

  let audioStreamEndPromise = new Promise((resolve, reject) => {
    audioStream.on('end', resolve)
  })

  return Promise.all([videoStreamEndPromise, audioStreamEndPromise])
}

function handleConversion (win, tempVideoPath, tempAudioPath, pathToSave) {
  return new Promise((resolve, reject) => {
    ffmpeg(tempVideoPath)
      .input(tempAudioPath)
      .output(pathToSave)
      .on('end', () => {
        fse.remove(tempVideoPath).then().catch(console.log)
        fse.remove(tempAudioPath).then().catch(console.log)
        resolve()
      })
      .on('progress', ({ percent }) => {
        win.webContents.send('video:download_progress', { percentDownloaded: percent })
      })
      .run()
  })
}

function notifyDLEnd (win) {
  win.webContents.send('video:download_success')
}
