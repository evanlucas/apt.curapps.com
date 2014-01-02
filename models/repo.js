var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var RepoSchema = new Schema({
  name: { type: String },
  date: { type: Date, default: Date.now },
  device: { type: String }
})

mongoose.model('Repo', RepoSchema)
