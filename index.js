'use strict'

var through = require('through2')
var replaceRequireCalls = require('replace-immediate-require-call')
var requireDeps = require('require-deps')
var findMain = require('find-main')
var resolveSync = require('resolve').sync
var ensureRelative = require('dot-slash').enforce
var path = require('path')

module.exports = function (file) {
  return through(function (code, enc, callback) {
    callback(null, replace(file, code))
  })
}

function replace (file, code) {
  return replaceRequireCalls(code, {
    'require-relative-main': function (idNode, cwdNode) {
      return requireStatement(file, idNode.value, cwd(file, cwdNode))
    }
  })
}

function requireStatement (from, id, cwd) {
  var mainDir = path.dirname(findMain(cwd))
  var dep = resolveSync(id, {basedir: mainDir})
  dep = path.relative(path.dirname(from), dep)
  return requireDeps(ensureRelative(dep))
}

function cwd (file, node) {
  if (node) {
    if (node.type === 'Identifier' && node.name === '__dirname') {
      return path.dirname(file)
    }
    if (node.type === 'Literal') {
      return path.resolve(file, arg.value)
    }
  }
  return process.cwd()
}
