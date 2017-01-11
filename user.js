

var User = require('./models/user.js');
var utils = require('./utils.js');

var retError = utils.retError;
var throwErrors = utils.throwErrors;

function addUser(req, res, params) {
	validAddUserParams(params, function(valid, msg) {
		if (!valid)
			return retError(res, msg);
		var user = {};
		user.name = params.name;
		user.mail = params.mail;
		user.age = params.age;
		user.sex = params.sex;
		user.creation_time = Date.now();
		user = new User(user);
		user.save(throwErrors(function(savedUser) {
			req.session.userid = savedUser.id;
			retOk(res);
		}));
	});
}

module.exports = {
	addUser:	addUser
}