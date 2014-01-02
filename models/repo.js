var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var RepoSchema = new Schema({
  name: { type: String },
  date: { type: Date, default: Date.now }
})

mongoose.model('Repo', RepoSchema)
