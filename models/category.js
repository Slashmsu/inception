var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic');

var CategorySchema = new Schema({
  name: { type: String, unique: true, lowercase: true}
});

CategorySchema.plugin(mongoosastic);

module.exports = mongoose.model('Category', CategorySchema);
