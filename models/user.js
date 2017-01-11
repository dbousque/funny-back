

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelName = 'user';

var userSchema = new Schema({
	name:			{type: String, required: true},
	mail:			{type: String, required: true},
	age:			{type: Number, required: true},
	sex:			{type: String, required: true},
	creation_time:	{type: Date, required: true},
	__v:			{type: Number, select: false}
});

var User = mongoose.model(modelName, userSchema, modelName);
User.toFrontFormat = function(obj, options, cb) {
	var res = {};
	res.id = obj._id;
	res.name = obj.name;
	res.mail = obj.mail;
	res.age = obj.age;
	res.sex = obj.sex;
	res.creation_time = obj.creation_time;
	cb(null, res);
};

module.exports = User;