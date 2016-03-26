var mongoose = require('mongoose');

var userchema = new mongoose.Schema({
    login:String,
	firstName: String,
	lastName: String,
	password: String,
    email:String,
	admin: Boolean
}, { collection: 'user' });

module.exports = mongoose.model('User', userchema);
