const { app } = require('electron')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const fse = require('fs-extra')
const shortid = require('shortid')
const ytdl = require('ytdl-core')
const path = require('path')

module.exports = {
  downloadVideoAndAudio (win, videoInfo, pathToSave) {
    let { videoStream, audioStream, tempVideoPath, tempAudioPath } = downloadVideoAndAudio(videoInfo)
    notifyVideoAndAudioDownloadStart(win, videoInfo, videoStream, audioStream)
    notifyVideoAndAudioDownloadProgress(win, videoInfo, videoStream, audioStream)
    handleVideoAndAudioDownloadEnd(videoStream, audioStream).then(() => {
      return handleVideoAndAudioConversion(win, videoInfo, tempVideoPath, tempAudioPath, pathToSave).then(() => {
        notifyVideoAndAudioDownloadEnd(win, videoInfo)
      })
    }).catch(console.log)
  }
}

function downloadVideoAndAudio (videoInfo) {
  const tempDir = path.join(app.getPath('temp'), `Electron_Downloader`)
  const randomTempName = shortid.generate()
  const tempAudioPath = path.join(tempDir, `${randomTempName}_audio`)
  const tempVideoPath = path.join(tempDir, `${randomTempName}_video`)

  let videoStream = ytdl(videoInfo.video_url, { filter: 'videoonly' })
  videoStream.pipe(fs.createWriteStream(tempVideoPath))

  let audioStream = ytdl(videoInfo.video_url, { filter: 'audioonly' })
  audioStream.pipe(fs.createWriteStream(tempAudioPath))

  return { videoStream, audioStream, tempVideoPath, tempAudioPath }
}

function handleVideoAndAudioDownloadEnd (videoStream, audioStream) {
  let videoStreamEndPromise = new Promise((resolve, reject) => {
    videoStream.on('end', resolve)
  })

  let audioStreamEndPromise = new Promise((resolve, reject) => {
    audioStream.on('end', resolve)
  })

  return Promise.all([videoStreamEndPromise, audioStreamEndPromise])
}

function handleVideoAndAudioConversion (win, { eventid }, tempVideoPath, tempAudioPath, pathToSave) {
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
        win.webContents.send(`video:download_progress_${eventid}`, { percentDownloaded: percent })
      })
      .run()
  })
}

function notifyVideoAndAudioDownloadStart (win, { eventid }, videoStream, audioStream) {
  let videoStreamStartPromise = new Promise((resolve, reject) => {
    videoStream.once('response', resolve)
  })

  let audioStreamStartPromise = new Promise((resolve, reject) => {
    audioStream.once('response', resolve)
  })

  Promise.all([videoStreamStartPromise, audioStreamStartPromise]).then(() => {
    win.webContents.send(`video:download_start_${eventid}`)
  })
}


function notifyVideoAndAudioDownloadProgress (win, { eventid }, videoStream, audioStream) {
  let percentDownloaded = 0
  let audioProgress = 0
  let videoProgress = 0

  videoStream.on('progress', (chunkLength, downloaded, total) => {
    videoProgress = ((downloaded / total) * 100)
    percentDownloaded = (audioProgress + videoProgress) / 2
    win.webContents.send(`video:download_progress_${eventid}`, { percentDownloaded })
  })

  audioStream.on('progress', (chunkLength, downloaded, total) => {
    audioProgress = ((downloaded / total) * 100)
    percentDownloaded = (audioProgress + videoProgress) / 2
    win.webContents.send(`video:download_progress_${eventid}`, { percentDownloaded })
  })
}

function notifyVideoAndAudioDownloadEnd (win, { eventid }) {
  win.webContents.send(`video:download_success_${eventid}`)
}

