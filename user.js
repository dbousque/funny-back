

var User = require('./models/user.js');
var utils = require('./utils.js');

var retError = utils.retError;
var retSendObject = utils.retSendObject;
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

function isExistingUser(req, res) {
	if (!('userid' in res))
		return retSendObject(res, {existing: false});
	User.findOne({_id: res.userid}, throwErrors(function(user) {
		if (!user)
		{
			req.session.destroy();
			return retSendObject(res, {existing: false});
		}
		retSendObject(res, {existing: true});
	}));
}

module.exports = {
	addUser:		addUser,
	isExistingUser:	isExistingUser
}