var bunyan = require('bunyan')
  , express = require('express')
  , fs = require('fs')
  , path = require('path')
  , sers = require('bunyan-serializers')

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
  log.info({ req: req })
  log.info('Requesting package', { name: req.params.packageName })
  res.sendfile(path.join(__dirname, 'debs', req.params.packageName))
})

var port = process.env.APT_PORT || 4005
log.info('listening on port', port)
app.listen(port)
