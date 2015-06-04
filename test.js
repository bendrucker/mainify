'use strict'

var test = require('tape')
var browserify = require('browserify')
var vm = require('vm')
var mainify = require('./')

test(function (t) {
  ;['simple', 'dirname'].forEach(bundle)
  function bundle (scenario) {
    t.test(scenario, function (t) {
      t.plan(1)
      browserify()
        .require(__dirname + '/fixtures/' + scenario, {
          expose: scenario
        })
        .transform(mainify)
        .bundle(function (err, code) {
          if (err) return t.end(err)
          var context = vm.createContext()
          vm.runInContext(code, context)
          var require = context.require
          t.equal(require(scenario), 'foo')
        })
    })
  }
})
