var fs = require('fs')
  , path = require('path')
  , mongoose = require('mongoose')
  , Package = mongoose.model('Package')
  , apt = exports

apt.initApp = function(app) {
  apt.app = app
}

apt.servePackagesGz = function(req, res) {
  res.sendfile(path.join(apt.app.config.root, 'Packages.gz'))
}

apt.servePackage = function(req, res) {
  var packageName = req.params.packageName
  var device = req.get('x-machine') ? req.get('x-machine') : 'NA'
  req.log.info('requesting package', {
    name: packageName,
    device: device
  })
  res.sendfile(path.join(apt.app.config.root, 'debs', packageName))
  var pkg = new Package({
    name: packageName,
    device: device
  })
  pkg.save(function(err) {
    if (err) {
      req.log.error('error recording package download', {
        err: err,
        package: packageName
      })
    } else {
      req.log.trace('successfully recorded package download', {
        package: packageName
      })
    }
  })
}
