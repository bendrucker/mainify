'use strict'

var test = require('tape')
var browserify = require('browserify')
var mainify = require('./')

test(function (t) {
  function bundle (scenario, callback) {
    t.test(scenario, planned, function (t) {
      t.plan(planned)
      browserify()
        .add(__dirname + '/fixtures/' + scenario)
        .transform(mainify)
        .bundle(function (err, code) {
          if (err) return t.end(err)
          callback(t, code)
        })
    })
  }
})
