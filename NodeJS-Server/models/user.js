var mongoose = require('mongoose');

var userchema = new mongoose.Schema({
	name: String,
	password: String,
	admin: Boolean
}, { collection: 'user' });

module.exports = mongoose.model('User', userchema);
