var path = require('path')
  , root = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    root: root,
    port: 4005,
    db: 'mongodb://localhost/apt_repo_stats'
  },
  test: {
    root: root,
    port: 4005,
    db: 'mongodb://localhost/apt_repo_stats'
  },
  production: {
    root: root,
    port: 4005,
    db: 'mongodb://apt:apt@localhost/apt_repo_stats'
  }
}
