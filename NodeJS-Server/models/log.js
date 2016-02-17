var mongoose = require('mongoose');
var logSchema = mongoose.Schema({
	message: String,
	timestamp: String,
	level: String
}, { collection: 'log' });

module.exports = mongoose.model('Log', logSchema);
