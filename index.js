'use strict'

var through = require('through2')
var detective = require('detective')
var hasRequire = require('has-require')
var requireDeps = require('require-deps')
var findMain = require('find-main')
var resolveSync = require('resolve').sync
var ensureRelative = require('dot-slash').enforce
var path = require('path')

var rrm = 'require-relative-main'

module.exports = function (file) {
  return through(function (code, enc, callback) {
    if (!hasRequire(code, rrm)) return callback(null, code)
    code = replaceImmediateCalls(file, code)
    callback(null, code)
  })
}

function replaceImmediateCalls (file, code) {
  return detective
    .find(code, {nodes: true}).nodes
    .filter(isRrmNode)
    .filter(immediateCall)
    .map(function (node) {
      var parent = node.parent
      return {
        start: parent.start,
        end: parent.end,
        raw: parent.arguments[0].value,
        cwd: cwd(file, parent) || process.cwd()
      }
    })
    .reduce(function (code, require) {
      var id = relative(file, require)
      return code.slice(0, require.start) + requireDeps(id) + code.slice(require.end)
    }, code)
}

function relative (file, require) {
  var mainDir = path.dirname(findMain(require.cwd))
  var dep = resolveSync(require.raw, {basedir: mainDir})
  dep = path.relative(path.dirname(file), dep)
  return ensureRelative(dep)
}

function isRrmNode (node) {
  var arg = node.arguments[0]
  return arg &&
    arg.value === rrm &&
    arg.type === 'Literal'
}

function immediateCall (node) {
  var parent = node.parent
  return parent &&
    parent.type === 'CallExpression' &&
    parent.arguments[0].type === 'Literal'
}

function cwd (file, node) {
  if (node.arguments.length < 2) return
  var arg = node.arguments[1]
  if (arg.type === 'Identifier' && arg.name === '__dirname') {
    return path.dirname(file)
  }
  if (arg.type === 'Literal') {
    return path.resolve(file, arg.value)
  }
}
