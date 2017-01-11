

var UserEvent = require('./models/userEvent.js');
var utils = require('./utils.js');

var throwErrors = utils.throwErrors;
var retOk = utils.retOk;

function addUserEvent(res, event) {
	var toStore = {};
	toStore.user = res.userid;
	toStore.time = Date.now();
	toStore.event = event;
	toStore = new UserEvent(toStore);
	toStore.save(throwErrors);
	retOk(res);
}

module.exports = {
	addUserEvent:	addUserEvent
}