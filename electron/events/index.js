const fs = require('fs')

fs.readdirSync(__dirname)
  .filter((fileName) => fileName !== 'index.js')
  .forEach((fileName) => {
    require(`./${fileName}`)
  })
