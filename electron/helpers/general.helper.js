const { app } = require('electron')
const fse = require('fs-extra')
const path = require('path')

module.exports = {
  isInDevMode () {
    return process.argv.includes('--dev')
  },
  ensureTempDirExists () {
    fse.ensureDirSync(getTempDir())
  },
  getTempDir
}

function getTempDir () {
  return path.join(app.getPath('temp'), `Electron_Downloader`)
}
