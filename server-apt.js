var bunyan = require('bunyan')
  , express = require('express')
  , fs = require('fs')
  , path = require('path')
  , sers = require('bunyan-serializers')
  , mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]

mongoose.connect(config.db, function(err) {
  if (err) log.error('error connecting to database', { err: err })
})

require('./models/pkg')

var log = bunyan.createLogger({
  name: 'apt server',
  serializers: sers
})

var app = express()
app.config = config
app.log = log


require('./config/router')(app)

log.info('serve', 'serving apt repository')

var port = process.env.APT_PORT || config.port || 4005
log.info('listening on port', port)
app.listen(port)
