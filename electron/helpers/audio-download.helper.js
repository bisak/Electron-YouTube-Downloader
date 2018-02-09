const { app } = require('electron')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const fse = require('fs-extra')
const shortid = require('shortid')
const ytdl = require('ytdl-core')
const path = require('path')
const { getTempDir } = require('../helpers/general.helper')

module.exports = {
  downloadAudio (win, videoInfo, pathToSave) {
    let { audioStream, tempAudioPath } = downloadAudio(videoInfo)
    notifyAudioDownloadStart(win, videoInfo, audioStream)
    notifyAudioDownloadProgress(win, videoInfo, audioStream)
    handleAudioDownloadEnd(audioStream).then(() => {
      return handleAudioConversion(win, videoInfo, tempAudioPath, pathToSave).then(() => {
        notifyAudioDownloadEnd(win, videoInfo)
      })
    })
  }
}

function downloadAudio (videoInfo) {
  let audioStream = ytdl(videoInfo.video_url, { filter: 'audioonly' })
  const tempAudioPath = path.join(getTempDir(), `${shortid.generate()}_audio`)
  audioStream.pipe(fs.createWriteStream(tempAudioPath))
  return { audioStream, tempAudioPath }
}

function handleAudioDownloadEnd (audioStream) {
  return new Promise((resolve, reject) => {
    audioStream.on('end', resolve)
  })
}

function handleAudioConversion (win, { eventid }, tempAudioPath, pathToSave) {
  return new Promise((resolve, reject) => {
    ffmpeg(tempAudioPath)
      .output(pathToSave)
      .on('end', () => {
        fse.remove(tempAudioPath).then().catch(console.log)
        resolve()
      })
      .on('progress', ({ percent }) => {
        win.webContents.send(`video:download_progress_${eventid}`, { percentDownloaded: percent })
      })
      .run()
  })
}

function notifyAudioDownloadStart (win, { eventid }, audioStream) {
  new Promise((resolve, reject) => {
    audioStream.once('response', resolve)
  }).then(() => {
    win.webContents.send(`video:download_start_${eventid}`)
  })
}


function notifyAudioDownloadProgress (win, { eventid }, audioStream) {
  audioStream.on('progress', (chunkLength, downloaded, total) => {
    let percentDownloaded = ((downloaded / total) * 100)
    win.webContents.send(`video:download_progress_${eventid}`, { percentDownloaded })
  })
}

function notifyAudioDownloadEnd (win, { eventid }) {
  win.webContents.send(`video:download_success_${eventid}`)
}

