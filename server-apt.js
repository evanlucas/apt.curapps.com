var bunyan = require('bunyan')
  , express = require('express')
  , fs = require('fs')
  , path = require('path')
  , sers = require('bunyan-serializers')
  , mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/apt_repo_stats', function(err) {
  if (err) log.error('error connecting to database', { err: err })
})

require('./models/repo')


var Repo = mongoose.model('Repo')

var log = bunyan.createLogger({
  name: 'apt.curapps.com',
  serializers: sers
})

var app = express()

log.info('serve', 'serving apt repository')
app.use(express.methodOverride())
app.use(express.static('/debs', __dirname + '/debs'))

var servePackages = function(req, res) {
  log.info({ req: req })
  res.sendfile(path.join(__dirname, 'Packages.gz'))
}

app.get('/Packages.gz', servePackages)
app.get('/./Packages.gz', servePackages)
app.get('/debs//:packageName', function(req, res) {
  var packageName = req.params.packageName
  log.info({ req: req })
  log.info('Requesting package', { name: packageName })
  res.sendfile(path.join(__dirname, 'debs', packageName))
  var device
  if (req.get('x-machine')) {
    device = req.get('x-machine')
  }
  var r = new Repo({
    name: packageName,
    device: device
  })
  r.save(function(err) {
    if (err) log.error('error recording package download', { err: err, package: packageName })
    else log.trace('successfully recorded package download', { package: packageName })
  })
})

app.get('/api/stats', function(req, res) {
  log.info({ req: req })
  Repo.aggregate(
      {$project: { name: 1 }},
      {$group: { _id: "$name", count: { $sum: 1}}},
      {$sort: { "count": -1 }}
    , function(err, results) {
      if (err) {
        log.error('error aggregating statistics', { err: err })
        res.json({ status: 'error', message:'error aggregating statistics'})
      } else {
        log.info('successfully aggregated statistics', { stats: results })
        res.json({ status: 'success', data: results})
      }
    })
})

app.get('/api/stats/days', function(req, res) {
  log.info({ req: req })
  Repo.aggregate(
    {$project: { name: 1, date: 1 }},
    {$group: { _id: {
      name: "$name",
      date: {
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" }
      }
    },
    count: { $sum: 1 }
    }},
    {$sort: { "date": -1}}
  , function(err, results) {
    if (err) {
      log.error('error aggregating statistics', { err: err })
      res.json({ status: 'error', message: 'error aggregating statistics'})
    } else {
      log.info('successfully aggregated statistics', { stats: results })
      res.json({ status: 'success', data: results })
    }
  })
})

app.get('/api/stats/device', function(req, res) {
  log.info({ req: req })
  Repo.aggregate(
    {$project: { name: 1, device: 1 }},
    {$group: { _id: {
      name: "$name",
      device: "$device"
    },
    count: { $sum: 1 }
    }},
    {$sort: { "count": -1 }}
  , function(err, results) {
    if (err) {
      log.error('error aggregating statistics', { err: err })
      res.json({ status: 'error', message: 'error aggregating statistics'})
    } else {
      log.info('successfully aggregated statistics', { stats: results })
      res.json({ status: 'success', data: results })
    }
  })
})

var port = process.env.APT_PORT || 4005
log.info('listening on port', port)
app.listen(port)
