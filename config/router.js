var express = require('express')
  , apt = require('../controllers/apt')
  , stats = require('../controllers/stats')

module.exports = function(app) {
  // configure express
  app.use(express.methodOverride())
  app.use(function(req, res, next) {
    req.log = app.log
    req.log.trace({ req: req })
    next()
  })

  apt.initApp(app)
  stats.initApp(app)
  // routes

  app.get('/Packages.gz', apt.servePackagesGz)
  app.get('/./Packages.gz', apt.servePackagesGz)
  app.get('/debs//:packageName', apt.servePackage)
  app.get('/api/stats', stats.getStats)
  app.get('/api/stats/days', stats.getDays)
  app.get('/api/stats/device', stats.getByDevice)
}
