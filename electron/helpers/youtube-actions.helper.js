const ytdl = require('ytdl-core')
const youtubeRegex = require('youtube-regex')
const isPlaylist = require('is-playlist')

module.exports = {
  validateVideoUrl (url) {
    return (youtubeRegex().test(url) && ytdl.validateURL(url)) || isPlaylist(url)
  }
}
