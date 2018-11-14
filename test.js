'use strict'

var test = require('tape')
var browserify = require('browserify')
var vm = require('vm')
var path = require('path')
var mainify = require('./')

test(function (t) {
  bundle('simple')
  bundle('dirname')
  bundle('multiple', 1, function (t, require) {
    t.deepEqual(require('multiple'), {
      foo: 'foo',
      bar: 'bar'
    })
  })
  function bundle (scenario, planned, callback) {
    t.test(scenario, function (t) {
      if (!planned) t.plan(1)
      browserify()
        .require(path.resolve(__dirname, 'fixtures', scenario), {
          expose: scenario
        })
        .transform(mainify)
        .bundle(function (err, code) {
          if (err) return t.end(err)
          var context = vm.createContext()
          vm.runInContext(code, context)
          var require = context.require
          if (planned) {
            t.plan(planned)
            return callback(t, require)
          }
          t.equal(require(scenario), 'foo')
        })
    })
  }
})
