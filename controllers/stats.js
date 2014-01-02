var fs = require('fs')
  , path = require('path')
  , mongoose = require('mongoose')
  , Package = mongoose.model('Package')
  , stats = exports

stats.initApp = function(app) {
  stats.app = app
}

stats.getStats = function(req, res) {
  Package.aggregate(
    {$project: { name: 1 }},
    {$group: { _id: "$name", count: { $sum: 1}}},
    {$sort: { "count": -1 }}
  , function(err, results) {
    if (err) {
      req.log.error('error aggregating statistics', { err: err })
      res.json({ status: 'error', message:'error aggregating statistics'})
    } else {
      req.log.trace('successfully aggregated statistics', { stats: results })
      res.json({ status: 'success', data: results})
    }
  })
}

stats.getDays = function(req, res) {
  Package.aggregate(
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
      req.log.error('error aggregating statistics', { err: err })
      res.json({ status: 'error', message: 'error aggregating statistics'})
    } else {
      req.log.trace('successfully aggregated statistics', { stats: results })
      res.json({ status: 'success', data: results })
    }
  })
}

stats.getByDevice = function(req, res) {
  Package.aggregate(
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
      req.log.error('error aggregating statistics', { err: err })
      res.json({ status: 'error', message: 'error aggregating statistics'})
    } else {
      req.log.info('successfully aggregated statistics', { stats: results })
      res.json({ status: 'success', data: results })
    }
  })
}
