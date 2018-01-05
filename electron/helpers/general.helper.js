module.exports = {
  isInDevMode () {
    return process.argv.includes('--dev')
  }
}
