let path = require('path')
let fs = require('fs')

function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), [])
}

function getDirectories(srcpath) {
  return fs
    .readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory())
}

function getDirectoriesRecursively(srcpath) {
  return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursively))]
}

module.exports = { getDirectories, getDirectoriesRecursively }
