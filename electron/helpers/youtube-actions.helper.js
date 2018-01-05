const ytdl = require('ytdl-core')
const youtubeRegex = require('youtube-regex')

module.exports = {
  validateVideoUrl (url) {
    return youtubeRegex().test(url) && ytdl.validateURL(url)
  }
}
