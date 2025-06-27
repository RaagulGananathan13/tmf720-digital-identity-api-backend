const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema({
  id: String,
  callback: String,
  query: String,
  hubStatus: String
});

module.exports = mongoose.model('Hub', hubSchema);
